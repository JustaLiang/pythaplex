use anchor_lang::prelude::*;

declare_id!("7nuUCA6rP1GP2D84Z13EUtiDQTJJ7hWHzLx3GBF87VDG");

#[program]
pub mod pythaplex {
    use super::*;

    pub fn create(ctx: Context<Create>, authority: Pubkey) -> ProgramResult {
        let trading_account = &mut ctx.accounts.trading_account;
        msg!(
            "remaining_accounts length: {}",
            ctx.remaining_accounts.len()
        );
        let pyth_price_acc = &ctx.remaining_accounts[0];
        trading_account.authority = authority;
        trading_account.pyth_price_pubkey = *pyth_price_acc.key;
        trading_account.long = true;
        trading_account.closed = true;
        let pyth_price_data = &pyth_price_acc.try_borrow_data()?;
        let pyth_price_data = pyth_client::cast::<pyth_client::Price>(pyth_price_data);
        trading_account.latest_price = pyth_price_data.agg.price;
        msg!("price: {}", trading_account.latest_price);
        trading_account.roi = 0;
        Ok(())
    }

    pub fn open(ctx: Context<Open>, open_long: bool) -> ProgramResult {
        let trading_account = &mut ctx.accounts.trading_account;
        let pyth_price_acc = &ctx.remaining_accounts[0];
        assert_eq!(trading_account.pyth_price_pubkey, (*pyth_price_acc.key));
        //update price
        let pyth_price_data = &pyth_price_acc.try_borrow_data()?;
        let pyth_price_data = pyth_client::cast::<pyth_client::Price>(pyth_price_data);
        trading_account.latest_price = pyth_price_data.agg.price;
        msg!("price: {}", trading_account.latest_price);
        //set long position
        trading_account.long = open_long;

        msg!(
            "open: {} position",
            match open_long {
                true => "long",
                false => "short",
            }
        );
        Ok(())
    }
}

// Transaction instructions
#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 40+40+1+1+8+2)]
    pub trading_account: Account<'info, TradingAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Open<'info> {
    #[account(mut, has_one = authority)]
    pub trading_account: Account<'info, TradingAccount>,
    pub authority: Signer<'info>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct TradingAccount {
    pub authority: Pubkey,
    pub pyth_price_pubkey: Pubkey,
    pub long: bool,
    pub closed: bool,
    pub latest_price: i64,
    pub roi: i16,
}

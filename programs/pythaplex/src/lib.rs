use anchor_lang::prelude::*;

declare_id!("CBHQsfr9CSKgqbGBXdc6U9JuhmfCDBzagERt3YvgGDD3");

#[program]
pub mod pythaplex {
    use super::*;
    
    pub fn initialize(
            ctx: Context<Initialize>,
            authority: Pubkey) -> ProgramResult {
        let trading_account = &mut ctx.accounts.trading_account;
        let pyth_price_acc = &ctx.remaining_accounts[0];
        trading_account.authority = authority;
        trading_account.pyth_price_pubkey = *pyth_price_acc.key;
        trading_account.closed = true;
        let pyth_price_data = &pyth_price_acc.try_borrow_data()?;
        let pyth_price_data = pyth_client::cast::<pyth_client::Price>(pyth_price_data);
        trading_account.latest_price = pyth_price_data.agg.price;
        msg!("price: {}", trading_account.latest_price);
        trading_account.roi = 0;
        Ok(())
    }
}

// Transaction instructions
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 40+40+1+8+2)]
    pub trading_account: Account<'info, TradingAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,    
}

// An account that goes inside a transaction instruction
#[account]
pub struct TradingAccount {
    pub authority: Pubkey,
    pub pyth_price_pubkey: Pubkey,
    pub closed: bool,
    pub latest_price: i64,
    pub roi: i16,
}
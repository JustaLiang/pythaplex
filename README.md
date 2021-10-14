# pythaplex
Solana project: Pyth network + Metaplex

# localhost
copy Pyth oracle account data to local validater
```
$ solana-test-validator -c H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG --url https://api.mainnet-beta.solana.com
```
open another terminal to test
```
$ anchor test
or
$ mocha -t 10000 tests/
```
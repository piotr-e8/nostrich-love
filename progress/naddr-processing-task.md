# Naddr Processing Task

**Date**: 2026-02-13
**Task**: Process naddr follow packs and extract accounts
**Input**: 3 nadrs + 1 npub for follow search

## Input Data

### Naddr 1 (Category TBD)
```
naddr1qvzqqqyckypzqxeup6tez2tf4yyp0n6fgzaglh0gw99ewytpccreulnpzsp5z5a3qythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qqjxywtrxsunyd3h956nzdp4956rswtp94skgdnx95ursdmzxsex2vfc8pjnxtl48jy
```

### Naddr 2 (Category TBD)
```
naddr1qvzqqqyckypzq96n3hp2vfmf6z2y8uvvxl97xk86kkalnqghx4p25lzl79c76a7yqythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qqxxx6t0vv6nser4w4n8guggtcxx7
```

### Naddr 3 (Category TBD)
```
naddr1qvzqqqyckypzq96n3hp2vfmf6z2y8uvvxl97xk86kkalnqghx4p25lzl79c76a7yqythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qy88wumn8ghj7mn0wvhxcmmv9uqzgcehxv6xgeryvckkywfnvykngvp3vyknsv3evykkgepev5mrsepnv4jngwqsal2xr
```

### Npub for Follow Search
```
npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4
```
**Target Categories**: permaculture, parents

## Next Steps

1. Decode nadrs to extract pubkeys
2. Fetch metadata from relays
3. Analyze account content to determine appropriate categories
4. Add to follow-pack with determined categories
5. Search follows of npub for permaculture/parents accounts
6. Add those accounts to appropriate categories

**Status**: Ready for processing

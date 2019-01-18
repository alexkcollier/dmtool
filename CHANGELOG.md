<a name="2.24.6"></a>
## [2.24.6](https://github.com/alexkcollier/dmtool/compare/v2.24.5...v2.24.6) (2019-01-18)


### Bug Fixes

* **bestiary:** ac parsing should only care if the AC is an array or not ([09455ae](https://github.com/alexkcollier/dmtool/commit/09455ae))



<a name="2.24.5"></a>
## [2.24.5](https://github.com/alexkcollier/dmtool/compare/v2.24.4...v2.24.5) (2019-01-18)


### Bug Fixes

* **magic-items:** fetches items correctly ([c75d121](https://github.com/alexkcollier/dmtool/commit/c75d121))



<a name="2.24.4"></a>
## [2.24.4](https://github.com/alexkcollier/dmtool/compare/v2.24.3...v2.24.4) (2019-01-14)


### Bug Fixes

* **bestiary:** adds fallback to tags ([d5d762f](https://github.com/alexkcollier/dmtool/commit/d5d762f))
* does not extract css ([2b527b8](https://github.com/alexkcollier/dmtool/commit/2b527b8))
* **bestiary:** removes old filter ([e750936](https://github.com/alexkcollier/dmtool/commit/e750936))



<a name="2.24.3"></a>
## [2.24.3](https://github.com/alexkcollier/dmtool/compare/v2.24.2...v2.24.3) (2019-01-11)


### Bug Fixes

* removes useless window checks ([58f594a](https://github.com/alexkcollier/dmtool/commit/58f594a))


### Performance Improvements

* PWA improvements ([3365e01](https://github.com/alexkcollier/dmtool/commit/3365e01))
* uses functional components ([8cb4c72](https://github.com/alexkcollier/dmtool/commit/8cb4c72))



<a name="2.24.2"></a>
## [2.24.2](https://github.com/alexkcollier/dmtool/compare/v2.24.1...v2.24.2) (2019-01-08)


### Bug Fixes

* **encounter:** fixes creatures not being removed on navigation/refresh ([abe86cc](https://github.com/alexkcollier/dmtool/commit/abe86cc))



<a name="2.24.1"></a>
## [2.24.1](https://github.com/alexkcollier/dmtool/compare/v2.24.0...v2.24.1) (2019-01-08)


### Bug Fixes

* improves offline support ([bab6182](https://github.com/alexkcollier/dmtool/commit/bab6182))



<a name="2.24.0"></a>
# [2.24.0](https://github.com/alexkcollier/dmtool/compare/v2.23.0...v2.24.0) (2019-01-07)


### Bug Fixes

* disables `vuex-persist` in ssr ([804241d](https://github.com/alexkcollier/dmtool/commit/804241d))


### Features

* fetches data from firebase ([334f768](https://github.com/alexkcollier/dmtool/commit/334f768))



<a name="2.23.0"></a>
# [2.23.0](https://github.com/alexkcollier/dmtool/compare/v2.22.0...v2.23.0) (2018-12-20)


### Bug Fixes

* **dice-roller:** removes `AdvantageRoller`. It is now redundant. ([5f38062](https://github.com/alexkcollier/dmtool/commit/5f38062))
* **dice-roller:** renames route ([03b569f](https://github.com/alexkcollier/dmtool/commit/03b569f))


### Features

* **dice-roller:** adds options and abilty to save rolls ([81b9f66](https://github.com/alexkcollier/dmtool/commit/81b9f66))
* **dice-roller:** allows deletion of all rollers ([91465e4](https://github.com/alexkcollier/dmtool/commit/91465e4))
* **dice-roller:** displays roll results in modal ([7aa99f1](https://github.com/alexkcollier/dmtool/commit/7aa99f1))
* **dice-roller:** uses separate components for features ([00ca55a](https://github.com/alexkcollier/dmtool/commit/00ca55a))



<a name="2.22.0"></a>
# [2.22.0](https://github.com/alexkcollier/dmtool/compare/v2.21.6...v2.22.0) (2018-12-14)


### Bug Fixes

* centers reset filters button ([61e2380](https://github.com/alexkcollier/dmtool/commit/61e2380))
* fixes button margins ([b62f633](https://github.com/alexkcollier/dmtool/commit/b62f633))
* improves mobile styles ([ac449cf](https://github.com/alexkcollier/dmtool/commit/ac449cf))


### Features

* adds simple dice roller ([643121d](https://github.com/alexkcollier/dmtool/commit/643121d))
* **roll-dice:** adds simple common rolls ([b096be7](https://github.com/alexkcollier/dmtool/commit/b096be7))
* improves die rolling experience ([675baf9](https://github.com/alexkcollier/dmtool/commit/675baf9))


### Reverts

* Revert "chore: updates eslint [skip ci]" ([ec72abc](https://github.com/alexkcollier/dmtool/commit/ec72abc))



<a name="2.21.6"></a>
## [2.21.6](https://github.com/alexkcollier/dmtool/compare/v2.21.5...v2.21.6) (2018-11-29)


### Bug Fixes

* **bestiary:** allows 'any race' to be a valid tag ([d2e6be7](https://github.com/alexkcollier/dmtool/commit/d2e6be7))



<a name="2.21.5"></a>
## [2.21.5](https://github.com/alexkcollier/dmtool/compare/v2.21.4...v2.21.5) (2018-11-20)


### Bug Fixes

* **bestiary:** properly displays legendary actions ([538270d](https://github.com/alexkcollier/dmtool/commit/538270d))
* **bestiary:** uses correct punctuation mark to join dmgCon ([1da3bf2](https://github.com/alexkcollier/dmtool/commit/1da3bf2))



<a name="2.21.4"></a>
## [2.21.4](https://github.com/alexkcollier/dmtool/compare/v2.21.3...v2.21.4) (2018-11-17)


### Bug Fixes

* **filter-panel:** fixes filters resetting on collapse ([2d9131d](https://github.com/alexkcollier/dmtool/commit/2d9131d))



<a name="2.21.3"></a>
## [2.21.3](https://github.com/alexkcollier/dmtool/compare/v2.21.2...v2.21.3) (2018-11-17)


### Bug Fixes

* **search:** moves query from getter to state ([46af37b](https://github.com/alexkcollier/dmtool/commit/46af37b))
* **filter-panel:** fixes filters resetting on collapse ([2d9131d](https://github.com/alexkcollier/dmtool/commit/2d9131d))



<a name="2.21.2"></a>
## [2.21.2](https://github.com/alexkcollier/dmtool/compare/v2.21.1...v2.21.2) (2018-11-16)


### Bug Fixes

* adds accessibility features ([6d07d0e](https://github.com/alexkcollier/dmtool/commit/6d07d0e))



<a name="2.21.1"></a>
## [2.21.1](https://github.com/alexkcollier/dmtool/compare/v2.21.0...v2.21.1) (2018-11-16)


### Bug Fixes

* prefetch icons ([08c1d56](https://github.com/alexkcollier/dmtool/commit/08c1d56))



<a name="2.21.0"></a>
# [2.21.0](https://github.com/alexkcollier/dmtool/compare/v2.20.0...v2.21.0) (2018-11-16)


### Features

* updates nuxt ([e1263cd](https://github.com/alexkcollier/dmtool/commit/e1263cd))



<a name="2.20.0"></a>
# [2.20.0](https://github.com/alexkcollier/dmtool/compare/v2.18.2...v2.20.0) (2018-11-16)


### Features

* introduces data build step ([a78670b](https://github.com/alexkcollier/dmtool/commit/a78670b))
* moves html parsing to build ([7f0be67](https://github.com/alexkcollier/dmtool/commit/7f0be67))
* **pwa:** adds precaching and improves runtime caching ([2013b92](https://github.com/alexkcollier/dmtool/commit/2013b92))
* separates search, filter, and result count ([f577ef5](https://github.com/alexkcollier/dmtool/commit/f577ef5))



<a name="2.19.0"></a>
# [2.19.0](https://github.com/alexkcollier/dmtool/compare/v2.18.2...v2.19.0) (2018-11-15)


### Features

* introduces data build step ([a78670b](https://github.com/alexkcollier/dmtool/commit/a78670b))
* moves html parsing to build ([dd7ffed](https://github.com/alexkcollier/dmtool/commit/dd7ffed))



<a name="2.18.2"></a>
## [2.18.2](https://github.com/alexkcollier/dmtool/compare/v2.18.1...v2.18.2) (2018-11-14)


### Bug Fixes

* **bestiary:** allows string or array for ac.from parsing ([b66f738](https://github.com/alexkcollier/dmtool/commit/b66f738))
* **search:** only shows 'enable all' if a filter is applied ([0889ddf](https://github.com/alexkcollier/dmtool/commit/0889ddf))



<a name="2.18.1"></a>
## [2.18.1](https://github.com/alexkcollier/dmtool/compare/v2.18.0...v2.18.1) (2018-11-13)


### Bug Fixes

* **magic-items:** fixes class filtering ([e776c81](https://github.com/alexkcollier/dmtool/commit/e776c81))



<a name="2.18.0"></a>
# [2.18.0](https://github.com/alexkcollier/dmtool/compare/v2.17.0...v2.18.0) (2018-11-12)


### Features

* **bestiary:** adds recharge parsing ([acfc7a5](https://github.com/alexkcollier/dmtool/commit/acfc7a5))



<a name="2.17.0"></a>
# [2.17.0](https://github.com/alexkcollier/dmtool/compare/v2.16.0...v2.17.0) (2018-11-12)


### Bug Fixes

* **entries:** displays table captions ([30a835e](https://github.com/alexkcollier/dmtool/commit/30a835e))
* **magic-items:** re-enables [@click](https://github.com/click) listener ([2c52890](https://github.com/alexkcollier/dmtool/commit/2c52890))


### Features

* **magic-items:** adds endless walk set ([8a9fc99](https://github.com/alexkcollier/dmtool/commit/8a9fc99))



<a name="2.16.0"></a>
# [2.16.0](https://github.com/alexkcollier/dmtool/compare/v2.15.0...v2.16.0) (2018-11-12)


### Bug Fixes

* **entry-helper:** fixes unsigned hits ([01c3cb6](https://github.com/alexkcollier/dmtool/commit/01c3cb6))
* **spells:** ensures class filter displays ([ca5cab7](https://github.com/alexkcollier/dmtool/commit/ca5cab7))


### Features

* **bestiary:** adds additional BBH creatures ([bc6a03e](https://github.com/alexkcollier/dmtool/commit/bc6a03e))



<a name="2.15.0"></a>
# [2.15.0](https://github.com/alexkcollier/dmtool/compare/v2.14.0...v2.15.0) (2018-11-12)


### Features

* **bestiary:** adds additional sources ([a64d971](https://github.com/alexkcollier/dmtool/commit/a64d971))
* **magic-items:** adds source ([6f40dc4](https://github.com/alexkcollier/dmtool/commit/6f40dc4))
* **spells:** adds source ([5b5ee5b](https://github.com/alexkcollier/dmtool/commit/5b5ee5b))



<a name="2.14.0"></a>
# [2.14.0](https://github.com/alexkcollier/dmtool/compare/v2.13.0...v2.14.0) (2018-11-12)


### Features

* **bestiary:** adds banshee queen ([47d9e69](https://github.com/alexkcollier/dmtool/commit/47d9e69))



<a name="2.13.0"></a>
# [2.13.0](https://github.com/alexkcollier/dmtool/compare/v2.12.3...v2.13.0) (2018-11-10)


### Features

* **bestiary:** improves tag handling, and adds them to filtering ([1582166](https://github.com/alexkcollier/dmtool/commit/1582166))
* **bestiary:** updates bestiary ([fa5e11e](https://github.com/alexkcollier/dmtool/commit/fa5e11e))
* **magic-items:** updates items ([ce6d8b7](https://github.com/alexkcollier/dmtool/commit/ce6d8b7))



<a name="2.12.3"></a>
## [2.12.3](https://github.com/alexkcollier/dmtool/compare/v2.12.2...v2.12.3) (2018-11-09)


### Bug Fixes

* catches things i missed ([eb7eeba](https://github.com/alexkcollier/dmtool/commit/eb7eeba))



<a name="2.12.2"></a>
## [2.12.2](https://github.com/alexkcollier/dmtool/compare/v2.12.1...v2.12.2) (2018-11-09)


### Bug Fixes

* **magic-items:** improves item exclusion ([9de7ea7](https://github.com/alexkcollier/dmtool/commit/9de7ea7))



<a name="2.12.1"></a>
## [2.12.1](https://github.com/alexkcollier/dmtool/compare/v2.12.0...v2.12.1) (2018-11-09)


### Bug Fixes

* **entries:** displays exact rolls correctly ([80fb341](https://github.com/alexkcollier/dmtool/commit/80fb341))



<a name="2.12.0"></a>
# [2.12.0](https://github.com/alexkcollier/dmtool/compare/v2.11.0...v2.12.0) (2018-11-07)


### Features

* **spells:** adds class lists to spells filter ([afaa7f0](https://github.com/alexkcollier/dmtool/commit/afaa7f0))



<a name="2.11.0"></a>
# [2.11.0](https://github.com/alexkcollier/dmtool/compare/v2.10.0...v2.11.0) (2018-11-07)


### Features

* adds new regexps ([a9b435a](https://github.com/alexkcollier/dmtool/commit/a9b435a))
* **bestiary:** updates data ([d62db5d](https://github.com/alexkcollier/dmtool/commit/d62db5d))
* **magic-items:** updates magic items ([39caba7](https://github.com/alexkcollier/dmtool/commit/39caba7))
* **spells:** updates spells ([a2766e1](https://github.com/alexkcollier/dmtool/commit/a2766e1))



<a name="2.10.0"></a>
# [2.10.0](https://github.com/alexkcollier/dmtool/compare/v2.9.1...v2.10.0) (2018-11-04)


### Bug Fixes

* improves centering of button text ([362e9a5](https://github.com/alexkcollier/dmtool/commit/362e9a5))
* **bestiary:** updates norixius' breath weapon ([068479b](https://github.com/alexkcollier/dmtool/commit/068479b))


### Features

* **bestiary:** adds dluur ([a356baf](https://github.com/alexkcollier/dmtool/commit/a356baf))



<a name="2.9.1"></a>
## [2.9.1](https://github.com/alexkcollier/dmtool/compare/v2.9.0...v2.9.1) (2018-10-30)


### Bug Fixes

* fixes item filter labels ([f008986](https://github.com/alexkcollier/dmtool/commit/f008986))



<a name="2.9.0"></a>
# [2.9.0](https://github.com/alexkcollier/dmtool/compare/v2.8.1...v2.9.0) (2018-10-16)


### Features

* **spells:** adds _conjure lightning_ ([4a26e37](https://github.com/alexkcollier/dmtool/commit/4a26e37))



<a name="2.8.1"></a>
## [2.8.1](https://github.com/alexkcollier/dmtool/compare/v2.8.0...v2.8.1) (2018-10-16)


### Bug Fixes

* **bestiary:** fixes typos ([31d8319](https://github.com/alexkcollier/dmtool/commit/31d8319))



<a name="2.8.0"></a>
# [2.8.0](https://github.com/alexkcollier/dmtool/compare/v2.7.2...v2.8.0) (2018-10-15)


### Bug Fixes

* **bestiary:** fixes Norixius' source ([209e9bf](https://github.com/alexkcollier/dmtool/commit/209e9bf))


### Features

* **bestiary:** adds pale orcs ([1eaba20](https://github.com/alexkcollier/dmtool/commit/1eaba20))



<a name="2.7.2"></a>
## [2.7.2](https://github.com/alexkcollier/dmtool/compare/v2.7.1...v2.7.2) (2018-10-12)


### Bug Fixes

* **bestiary:** link norixius properly ([3595c98](https://github.com/alexkcollier/dmtool/commit/3595c98))



<a name="2.7.1"></a>
## [2.7.1](https://github.com/alexkcollier/dmtool/compare/v2.7.0...v2.7.1) (2018-10-11)


### Bug Fixes

* **search:** disables autocomplete ([cfda3f4](https://github.com/alexkcollier/dmtool/commit/cfda3f4))



<a name="2.7.0"></a>
# [2.7.0](https://github.com/alexkcollier/dmtool/compare/v2.6.6...v2.7.0) (2018-10-11)


### Bug Fixes

* **search:** Improves fuzzy search specificity ([f63ef93](https://github.com/alexkcollier/dmtool/commit/f63ef93))


### Features

* **semantic-release:** adds semantic releases ([4c524c1](https://github.com/alexkcollier/dmtool/commit/4c524c1))




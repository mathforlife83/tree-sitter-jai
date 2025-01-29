[33mcommit 1eed88832e4eb5f07a8839bda1a169cb1d199e06[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmaster[m[33m)[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Jan 28 22:40:42 2025 +0200

    modified readme

[33mcommit 273d8b160f354f3a4a26cffe1c52ca671459c443[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Jan 28 22:38:20 2025 +0200

    fixed caller_exepression that are compiler directives, added library_expression.

[33mcommit e4eb562b8f144bbe3eb85af2006d51479fbacfc2[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Jan 28 05:52:47 2025 +0200

    added an optional block to module_parameters

[33mcommit 328e979037ad54d2d63cbfe50babf7410464f014[m[33m ([m[1;31mgithub/master[m[33m)[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Jan 28 04:02:06 2025 +0200

    push_context does not require a semicolon either (except for defer_pop)

[33mcommit a8cc5b0845976a1694a017ad9de86a1edd03d03e[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Jan 28 02:53:59 2025 +0200

    backticked statement does not need a semicolon

[33mcommit 9a666ca3e82f97ddc8f62d20dc37a45bd4a37ecd[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 26 22:40:49 2025 +0200

    php, it was php

[33mcommit d5b4429db778a97b292ecd2d23d37dac2056f0fb[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 26 22:39:47 2025 +0200

    added credits

[33mcommit 131ee5c1fa33ac6c14e1f814ef93f36bc5c86783[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 26 22:34:58 2025 +0200

    fixed an indentation issue and modified some comments in queries

[33mcommit c6f4455e4a7174c8f400d60c9a996c81ee1092a2[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 26 19:33:16 2025 +0200

    changed variable names, added push_context

[33mcommit a9d8747ce7272e5dc84ff340eae0578ca60f65a3[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 26 18:56:53 2025 +0200

    added optional semicolon on struct block

[33mcommit 17f26acb69b8d5b79c1db2bc9d512db12ff2b15b[m
Author: constantitus <constantitus@gmail.com>
Date:   Thu Jan 23 03:43:12 2025 +0200

    modified readme, the grammar_test and now there is some commented code in the scanner.c

[33mcommit 964820616cb31b90624698f2c37fea68e7ef08e6[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Jan 22 23:23:54 2025 +0200

    whoops

[33mcommit f631cd93ab1b0c21c69a1d51ccdf27d77011c888[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Jan 21 03:20:20 2025 +0200

    added aliases for compiler_declaration and updated queries

[33mcommit 77f269e2200965ea6ba53aff502312b1274f3056[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Jan 21 02:50:29 2025 +0200

    changed precedence for compiler_directive

[33mcommit a4c3531dca44e45f7803d878cc2cda33bbe31d7a[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 19 03:20:40 2025 +0200

    whoops

[33mcommit eeff1cbadfae8e74da267a8b283dc0d24bd2318e[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 19 02:13:10 2025 +0200

    fixed some issues and reorganized grammar code

[33mcommit f91dc9f8cf9e9b9b075aa0fc3e9067bba11a8af6[m
Author: constantitus <constantitus@gmail.com>
Date:   Fri Jan 17 20:51:24 2025 +0200

    fixed "member.call_expression()"

[33mcommit b09ac530e6b01df27036e715f9b46a29ca7e7ac7[m
Author: constantitus <constantitus@gmail.com>
Date:   Fri Jan 17 04:59:57 2025 +0200

    fixed the following syntax not working: "[]u8.{data=0, count=0}"

[33mcommit 18f7b40e7767e307bdb99f7483be4582a4bc01bb[m
Author: constantitus <constantitus@gmail.com>
Date:   Fri Jan 17 02:12:13 2025 +0200

    merged run and insert expressions as they are similar

[33mcommit 166c1c7a684a1bf843d19e63ca4308d45f1d50a8[m
Author: constantitus <constantitus@gmail.com>
Date:   Thu Jan 16 23:11:31 2025 +0200

    removed floats with no decimals (0.) because they break for loop ranges

[33mcommit 3eb572104bda4585161a1f44f2fbdfad10c0f9f3[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Jan 14 20:06:32 2025 +0200

    shortened readme (x2)

[33mcommit feef016f9190583f6e92cb7846969bee1a4ad252[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Jan 14 20:05:37 2025 +0200

    shortened readme

[33mcommit 2d9b6e1f285836c4ac8c88c8e79ab8bb74bb0ffd[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 12 17:49:38 2025 +0200

    fixed issue regarding parenthesised expression containing just an identifier. also indexing members when declaring struct literals.

[33mcommit 66a172745685c8b850785146c62028057723fc48[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Jan 11 22:33:34 2025 +0200

    allow anonymous struct and enum declarations without semicolon

[33mcommit 3c64a01a087aa30e71b0c16d5b85c73d61ba9a05[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Jan 11 21:45:19 2025 +0200

    fixed hilighting issue with struct literals

[33mcommit 9f0f4678b1779bc45ea32a5315928b5b351ef559[m
Author: constantitus <constantitus@gmail.com>
Date:   Fri Jan 10 04:08:36 2025 +0200

    added function-like casting and backtick syntax

[33mcommit 1f35492d54297a140d0c562c5bce3f690252e86c[m
Author: constantitus <constantitus@gmail.com>
Date:   Thu Jan 9 23:19:28 2025 +0200

    minor improvements to queries

[33mcommit 63f82e2fffe2dc3665377908f491dc05cdd4b425[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Jan 8 00:03:12 2025 +0200

    updated using statements, added remove statement

[33mcommit 56765be264f489c5a0f5c8410fdc3e1c1e6963bf[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 5 23:50:59 2025 +0200

    updated readme

[33mcommit 73634fbaa44f2662cc31a4ae40c64edbd099e9e1[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 5 16:57:28 2025 +0200

    updated grammar_test.jai

[33mcommit 4685986312a7614c6fe9dc043c0a7cf3d96fb659[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 5 16:53:21 2025 +0200

    updated readme

[33mcommit 1cdb6df8260bb68391173db4e332c37834092ea6[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 5 16:53:09 2025 +0200

    added heredoc strings (and scanner.c !!!!!)

[33mcommit a84a345a5ae99b6f74139a0d53bb2fae4c1a7706[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Jan 5 00:48:48 2025 +0200

    fixed a bunch of stuff

[33mcommit bed7ef6f1f2d58f511f721d50a5539d8c7f54b54[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Dec 25 15:27:36 2024 +0200

    fighting with indent queries

[33mcommit 7719a0f6057f57019af97be8631d6a3adc09d202[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Dec 24 07:37:40 2024 +0200

    fixed some issue with floats

[33mcommit ddc19fa1bf9cf5efb6884c65f7f40c40a8cc547f[m
Author: constantitus <constantitus@gmail.com>
Date:   Mon Dec 23 20:05:50 2024 +0200

    small fixes

[33mcommit ee8bf0cb2657d2aea47408744e3e62f0c589ae20[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Dec 21 00:17:54 2024 +0200

    using statements in global scope, small change to highlights

[33mcommit f4f3627e0b9c8f86d32c2e8a83b08f32bfab4faf[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Dec 17 04:35:59 2024 +0200

    added pointer for_statement

[33mcommit 93e8f66ca1a81bb23f2e425228b140d61349f6f9[m
Author: constantitus <constantitus@gmail.com>
Date:   Mon Dec 16 23:48:45 2024 +0200

    forgot to add queries to the last commit

[33mcommit d83dec8acaa4f7119f816bed1ea6886a898c991f[m
Author: constantitus <constantitus@gmail.com>
Date:   Mon Dec 16 23:47:14 2024 +0200

    fixed issues regarding procedures and simplified a lot

[33mcommit 0bfa0766c9b144654844840e7863ef355deaa439[m
Author: constantitus <constantitus@gmail.com>
Date:   Fri Dec 13 20:32:58 2024 +0200

    added notes

[33mcommit 4478da1d08ed144cc16d87fa0da2c6c61b88bf55[m
Author: constantitus <constantitus@gmail.com>
Date:   Fri Dec 13 19:08:22 2024 +0200

    fixed multiply expression being confused with address

[33mcommit 3c60f5cb8508b26db15e37c84e71375a86b44a95[m
Author: constantitus <constantitus@gmail.com>
Date:   Fri Dec 13 06:27:08 2024 +0200

    fixed some issuses

[33mcommit 0f7737518cd168959a8b7522c2884f8415c6240f[m
Author: constantitus <constantitus@gmail.com>
Date:   Mon Dec 9 19:40:16 2024 +0200

    added #as using statement

[33mcommit a95db890a716fc1bf4b9e2ceb74b103745911827[m
Author: constantitus <constantitus@gmail.com>
Date:   Mon Dec 9 19:31:47 2024 +0200

    fixed struct literals

[33mcommit 2ce2ba76d2cb75ee7d1a0c5f9c6f9ac496d488b2[m
Author: constantitus <constantitus@gmail.com>
Date:   Mon Dec 9 18:55:55 2024 +0200

    fixed a lot of bugs

[33mcommit a94b1cc47739514b26036ffe4e15e2fcc8d22985[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Dec 7 00:03:47 2024 +0200

    fixed else block indents

[33mcommit 00b2ca0083745c75f1ecbac6f023c5242be7a45c[m
Author: constantitus <constantitus@gmail.com>
Date:   Fri Dec 6 22:06:05 2024 +0200

    fixed if case indenting

[33mcommit e6f1f86b1f95624d441286d64ffe6f916351be66[m
Author: constantitus <constantitus@gmail.com>
Date:   Thu Dec 5 01:01:28 2024 +0200

    refactor + fixed a lot of issues

[33mcommit 33f92c445bb19295b5b182fe1fec619964e9c87f[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Dec 4 18:10:08 2024 +0200

    whoops

[33mcommit 83ef091a13f4fef771ac46be897466f2fc2d7028[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Dec 4 18:06:17 2024 +0200

    fixed some precedence issues

[33mcommit 28cc1cbc1131b23a0e6aa0b2afec2d3752057e04[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Dec 4 17:03:39 2024 +0200

    don't allow strings extend to the next line unless escaped

[33mcommit 4c52a61ad670118a8f458b00b7e8664cef571e78[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Dec 4 16:48:52 2024 +0200

    minor modification

[33mcommit a3f9b838c6c9757788eff5a57977088c8df29f27[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Dec 4 16:40:40 2024 +0200

    added run expression block

[33mcommit 6d569dffbb428cb7d0bd78fd6f88cfe96c6c8d2b[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Dec 4 16:17:30 2024 +0200

    updated queries

[33mcommit d113fadd0c756513691744ed7a05da94ee5dc83c[m
Author: constantitus <constantitus@gmail.com>
Date:   Wed Dec 4 16:16:23 2024 +0200

    fixed some precedence issues

[33mcommit ab8ecfa03613a0e706abf41604abe7f37ff90a3c[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Dec 3 22:58:51 2024 +0200

    added #asm

[33mcommit a2557817016d73590f4661897cd930b719a7e020[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Dec 3 06:05:05 2024 +0200

    enum_flags and anonymous enum types

[33mcommit a178df82b6ae9f59579885f7facc28a6716fe382[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Dec 3 02:56:15 2024 +0200

    some things I forgot to modify from the default generated template

[33mcommit d5e7ba3a34fce76fac35cdaa53d02c73ad1d6339[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Dec 3 02:55:36 2024 +0200

    nested block comments

[33mcommit c31f9959e65ffcc23235acdb14e547e6bd21453c[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Dec 3 02:02:42 2024 +0200

    minor line comment modification

[33mcommit d70b26dc22a37fd1c380f9aaa5bb496145e853e8[m
Author: constantitus <constantitus@gmail.com>
Date:   Tue Dec 3 01:28:34 2024 +0200

    fixed an error regarding member expressions and some minor things

[33mcommit 7f6b1e14c96ffc86bc81713deea0b73a1af0e678[m
Author: constantitus <constantitus@gmail.com>
Date:   Mon Dec 2 21:45:24 2024 +0200

    added rotate operators, fixed indents

[33mcommit c217b9f74a731636842bd8fc385a438743a55fd6[m
Author: constantitus <constantitus@gmail.com>
Date:   Mon Dec 2 03:43:36 2024 +0200

    fixed some issues

[33mcommit 4f88724b73002f80cd07d360cf860015ef9fcaea[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Dec 1 18:25:44 2024 +0200

    organized code and fixed some things

[33mcommit c0600030d1e2afeadc8dbb17dd0c283021a7d0c9[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Dec 1 02:50:15 2024 +0200

    fixed precedence issues, added some stuff

[33mcommit 972319b00fcc038dc1a031dba1b5c890409b744a[m
Author: constantitus <constantitus@gmail.com>
Date:   Sun Dec 1 00:00:44 2024 +0200

    fixed polymorphic_struct_type conflicting with call_expression

[33mcommit f3ed5194a37d55645e90479badc4a52cbeb99fb5[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Nov 30 19:43:46 2024 +0200

    updated queries

[33mcommit 258f750f9aa5e833d40e80e02f204d95077f96e2[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Nov 30 19:40:20 2024 +0200

    enabled limited if expressions

[33mcommit 4b287da7830e316e3c8e6fabaa55418d2a606d16[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Nov 30 05:05:33 2024 +0200

    disabled ifx, added README

[33mcommit 9ee4a8f1799f56ae75a0106298b2d9a477c36a95[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Nov 30 04:30:20 2024 +0200

    added license

[33mcommit 475437006c4c486d0dadbc76d0a6a27a35ac17d0[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Nov 30 04:27:00 2024 +0200

    added highlights and indents

[33mcommit 1144a28219fbb1a21f08052353659c459791b436[m
Author: constantitus <constantitus@gmail.com>
Date:   Sat Nov 30 02:23:41 2024 +0200

    initial commit

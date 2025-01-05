# tree-sitter-jai
Tree-sitter grammar for the language. I needed it because I rely on tree-sitter for
auto indents. It is incomplete, but I intend to make it better as I'm learning the
language.

This syntax now uses an external scanner. If you're using neovim, you should add "scanner.c"
into parser_config.jai.install_info.files in your lua config.

# TODO
*I prioritize fixing issues based on how badly they break the parsing*
- [x] nested block comments (without external scanner)
- [x] inline assembly
- [x] #modify block
- [x] #string (it did require external scanner)
- [x] parameterized module imports
- [ ] fix for loop range getting confused with floats. e.g. `0..1` is (float `0.`) (float `.1`) and `0..count` is (float `0.`) + (member_expression `.count`)
- [ ] macros, backticks, expand, insert
- [ ] cannot diferentiate between taking the address of a variable and a pointer type (does not break the syntax highlighting, so I don't care)

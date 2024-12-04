# tree-sitter-jai
Tree-sitter grammar for the language. I needed it because I rely on tree-sitter for
auto indents. It is incomplete, but I intend to make it better as I'm learning the
language.

# TODO
- [x] run statements
- [x] organize code and label things
- [x] using statements
- [x] fix floats...
- [x] nested block comments (without external scanner)
- [x] comma sepparated variable declarations doesn't seem to work for some bizzare reason and I can't seem to be able to get it to work
- [x] if expressions are somewhat limited due to them increasing the complexity (and slowness) of the parser
- [ ] fix conflicts which I lazily ignored before
- [ ] custom iterators such as "for :utf8_iter"
- [ ] macros
- [ ] #string
- [ ] parameterized module imports
- [ ] cannot diferentiate between taking the address of a variable and a pointer type

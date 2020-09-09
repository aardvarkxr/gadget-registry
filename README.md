# The Aardvark Gadget Registry

Welcome to the simplest possible global registry for Aardvark gadgets. 

This repository contains one file of note: `registry.json`. 
This file is loaded by Aardvark when it starts up and provides a global list of useful to gadgets to users.

If you would like your gadget to appear in the registry, just submit a pull request that adds it to `registry.json`.

No reasonable gadget will be refused (for some reasonable definition of "reasonable".)
The few requirements are:

* The gadget must be on a server somewhere that is publically accessible so users can actually use it.
* The gadget must have some kind of glTF icon so users can see it in the menu.

## Removing gadgets from the registry

If you want your gadget to be removed from the registry, just submit a new pull request that pulls it out of `registry.json`.


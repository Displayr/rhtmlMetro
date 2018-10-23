# rhtmlMetro

rhtmlMetro

# Installation in R

1. `library(devtools)`
1. `install_github('Displayr/rhtmlMetro')`

Simplest Example to verify installation:

```
rhtmlMetro::Box(text = "text")
```


# Local Installation to Develop/Contribute

**Prerequisites** - For help installing prerequisites see the `Prequisite Installation Help` section below

1. nodejs >= 6.9.5
1. yarn > 0.21 (install via npm install -g yarn)
1. python 2.7 - one of the nodejs libraries needs python during the installation process
1. (optional) r >= 3.0.0 - you can develop without R, but cannot produce r docs or test in r 

## Installing the rhtmlMetro code

1. Change directory to the place where you put git projects
1. type `git clone git@github.com:Displayr/rhtmlMetro.git` ENTER
1. type `cd rhtmlMetro` ENTER
1. type `yarn install` ENTER
    1. `yarn install` is noisy and will print several warnings about `UNMET` and `DEPRECATED`. Ignore these and only make note of errors. If it fails, try running it again.
1. type `gulp serve` ENTER
    1. If `gulp serve` does not work try `./node_modules/.bin/gulp serve`. To correct this and to make your nodejs life easier you should add `./node_modules/.bin` to your PATH. Consult the Internet for instructions on how to do so on your OS of choice.

If this worked, then the `gulp serve` command opened your browser and you are looking at `http://localhost:9000`. You should see a page listing a bunch of links to examples, each example shows the simple 4 square widget template. These examples are defined in the [internal www content directory](theSrc/internal_www/content).

## Prerequisite Installation Help

### Install nodejs on OSX

1. Install brew by following instructions here : http://brew.sh/
1. Install nvm (node version manager) by running `brew install nvm`
1. Install node by running `nvm install 6.1.0` on the terminal

### Install nodejs on Windows

1. Setup nodist. https://github.com/marcelklehr/nodist and find the link to the official installer.
1. Open the command prompt. Type: `nodist v6.1.0`
1. Type `node -v` and verify the version is correct

### Python on OSX - it should come installed. If not

1. Install brew (if not done already) by following instructions here : http://brew.sh/
1. Install python by running `brew install python` on the terminal - make sure you get 2.7

### Python on Windows

1. Download version 2.7 from https://www.python.org/downloads/

### R on OSX

1. Install brew by following instructions here : http://brew.sh/
1. Run the following commands:
    ```
    brew tap homebrew/science
    brew install Caskroom/cask/xquartz
    brew install r
    ```
1. Now start r by running the R `r` command, and in the R terminal run these commands:
    ```
        install.packages("devtools")
        install.packages("roxygen2")
    ```

[![Displayr logo](https://mwmclean.github.io/img/logo-header.png)](https://www.displayr.com)

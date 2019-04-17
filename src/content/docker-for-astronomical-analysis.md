---
title: "Astrophysical data analysis setup, using Docker"
author: Matteo
tags: ["Software"]
image: img/docker.png
date: "1922-12-12T10:00:00.000Z"
draft: false
---

(This post is highly outdated. Use with caution)

Having an up-to-date machine and not having to reinstall software at each OS upgrade is considered a chimera. If one wants an up-to date system with the shiny new version of the presentation software, or the latest upgrade of that linux graphical environment, the tradeoff is often having to reinstall all the data analysis software, because the system libraries, because permissions, because whatever.

So, shiny new system with periodic full upgrade of the analysis software, or stable, long-term-support boring version of the OS, maintaining software compatibility? And what about incompatibilities with new software?

A trick might be using a virtual machine. You fire up VirtualBox, you get an Ubuntu ISO, you install it on a 20-GB virtual disk, and you install all your software there. Point is, the VM will take up half of your RAM if you want some performance, mostly because of duplicate and useless things such as the desktop environment and tons of additional programs (I guess you are not using firefox and thunderbird on your virtual machine, when you can run them from the host OS).

In the last few years, I've used Travis CI for unit testing, and I heard about *Containers*.
Containers are much lighter than virtual machines, they contain only the minimum pre-installed software needed, and you choose what to install in them.

Here, I will not give a full account of the possibilities that Docker offers. Rather, I will throw down a few notes on how to obtain a working Linux container with your software installed inside, that you can fire up whenever you need it.

 

## On OSX

### Installation

Install [Docker](https://www.docker.com/) and [Socat](http://www.dest-unreach.org/socat/). For the former, you can download the installer from the main website. For the latter, you can install it easily with `apt-get`, `yum`, `brew`, or whatever your favorite package manager is on a Unix system. Socat is needed if you want to use X11 applications, which is the case for me.

### Boot Docker
On my Mac, I have a `Docker Quickstart Terminal` Application that opens a terminal and executes a script to make all Docker-related variables and paths available. I don't know about Linux, but the docs are usually very clear in the main website.
Once you do that, you will notice that you have a new network adapter appearing in `ifconfig`:
```
$ ifconfig
(...)
vboxnet0: flags=8943<UP,BROADCAST,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1500
	ether 0a:00:27:00:00:00 
	inet 192.168.99.1 netmask 0xffffff00 broadcast 192.168.99.255
(...)
```
this is because Docker, under the hood, is starting a virtual machine that only manages Linux-specific operations, like the kernel. On Linux systems, this is not required, and Docker runs even faster. Take note of the `inet` address, it will be used afterwise to set the `DISPLAY` for X11 applications.

### Create shared directories
Let us create a directory that we will use for software installation, and another for data analysis, in the host system
```
$ mkdir ~/linux_software ~/linux_analysis
```
From now on, all *compiled* software will be installed in `linx_software`, and will be available to multiple containers through a shared folder mechanism. This avoids cluttering the container with unstable software that needs frequent updates. Same goes to `linux_analysis`, where we will put the data to analyze.

### Configure a new container with all base libraries and dependencies
First of all, let us create a new container with a Ubuntu 14.04 base.

```
$ docker pull ubuntu:14.04
```
To fire it up, just do
```
$ docker run -ti ubuntu /bin/bash
```
In a few seconds you will find yourself logged as root in a new basic virtual machine:
```
root@wh4t4n1ceh4sh:/# 
```
where `wh4t4n1ceh4sh` is a hash string, that identifies the container and changes every time.

I usually do not run analysis as root, but I create a user first:

```
root@wh4t4n1ceh4sh:/# useradd pulsar -m
root@wh4t4n1ceh4sh:/# passwd pulsar
root@wh4t4n1ceh4sh:/# su - pulsar
```
I will install the dependencies as root, and the analysis software as user `pulsar`.

Maybe I want to install the pulsar analysis software [following this great reference](http://www.ljtwebdevelopment.com/pulsarref/pulsar-software-install-ubuntu.html). In this case, as root, I run
```
root@wh4t4n1ceh4sh:/# apt-get update
root@wh4t4n1ceh4sh:/# apt-get install csh build-essential gfortran tk tk-dev libpng-dev libgd2-xpm-dev cvs autoconf automake libtool m4 git gsl-bin libgsl0-dev flex bison fort77 libglib2.0-dev gnuplot gnuplot-x11 python-dev python-numpy python-scipy python-matplotlib ipython ipython-notebook python-pandas python-sympy python-nose swig
root@wh4t4n1ceh4sh:/# apt-get clean
```

That's it for root. Now, **on a new Docker Terminal on the Mac**, you save the container with the installed software:
```
docker export wh4t4n1ceh4sh > psr_software_docker_image.tar
```
(see[here](http://tuhrig.de/difference-between-save-and-export-in-docker/) for more details) and you import the container as a new image:
```
cat psr_software_docker_image.tar | docker import - pulsar
```
From now on, you will be able to fire up a `pulsar` container containing all the dependencies that are needed to run your analysis software, that you will install in a shared directory instead.

### Run the machine and install the analysis software
Set correctly the DISPLAY variable, allow forwarding, and boot the machine:
```
$ socat TCP-LISTEN:6000,reuseaddr,fork UNIX-CLIENT:\"$DISPLAY\" &
$ docker run -ti -e DISPLAY=192.168.99.1:0 -v "/Users/meo/linux_software/:/home/pulsar/pulsar_software/" -v "/Users/meo/linux_analysis/:/home/pulsar/analysis/" pulsar /bin/bash

root@ef6118cb1081:/# 
```
Log in as user. From now on, the installation I show is taken from [this guide on pulsar software installation](http://www.ljtwebdevelopment.com/pulsarref/pulsar-software-install-ubuntu.html). Adapt to your needs!
```
root@ef6118cb1081:/# su - pulsar
pulsar@ef6118cb1081:~$ 
```
Keep in mind that **everything you will do in the machine, will be deleted as soon as you shut it down**. To set environment variables, create a `.pulsar_env` file in the shared software directory with the environment variables and aliases you want, and initialize it every time you log in a new container, e.g.:
```
pulsar@ef6118cb1081:~$ cat > software/.pulsar_env
# Path to the pulsar software installation directory eg:
export SOFTWARE_DIR=/home/pulsar/pulsar_software

# OSTYPE
export OSTYPE=linux

# PSRCAT
export PSRCAT_FILE=$SOFTWARE_DIR/psrcat_tar/psrcat.db

# Tempo
export TEMPO=$SOFTWARE_DIR/tempo

# Tempo2
export TEMPO2=$SOFTWARE_DIR/tempo2/T2runtime

# PGPLOT
export PGPLOT_DIR=$SOFTWARE_DIR/pgplot_build
export PGPLOT_DEV=/xwindow

# PRESTO
export PRESTO=$SOFTWARE_DIR/presto

# LD_LIBRARY_PATH
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$SOFTWARE_DIR/lib:\
$SOFTWARE_DIR/pgplot_build:$SOFTWARE_DIR/presto/lib

# PATH
# Some Presto executables match sigproc executables so keep separate -
# all other executables are found in $SOFTWARE_DIR/bin
export PATH=$PATH:$SOFTWARE_DIR/bin:$SOFTWARE_DIR/presto/bin

# PYTHON PATH eg.
export PYTHONPATH=$PRESTO/lib/python:$SOFTWARE_DIR/lib/python2.7/site-packages

pulsar@ef6118cb1081:~$ . pulsar_software/.pulsar_env
```
And you're ready to install your software!

### Run the analysis software
After you're done installing the software, it's simple. 
Put the data you want to install in linux_analysis, then open a Docker Terminal, and
```
$ docker run -ti -e DISPLAY=DISPLAY=192.168.99.1:0 -v "/Users/meo/linux_software/:/home/pulsar/pulsar_software/" -v "/Users/meo/linux_analysis/:/home/pulsar/analysis/" pulsar /bin/bash

root@ef6118cb1081:/# su - pulsar
pulsar@ef6118cb1081:~$ . pulsar_software/.pulsar_env
pulsar@ef6118cb1081:~$ cd linux_analysis
pulsar@ef6118cb1081:~$ <RUN_YOUR_ANALYSIS>
```
and we're done. Hope this is useful. Feel free to suggest caveats or additions.

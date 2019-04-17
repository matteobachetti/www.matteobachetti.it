---
title: "Matteo's Library and Tools in Python for NuSTAR Timing"
author: Matteo
tags: ["Software"]
image: img/maltpynt.png
date: "1922-12-10T10:00:00.000Z"
draft: false
---

(This post is highly outdated. Use with caution)

<p>MaLTPyNT, Matteo's Library and Tools in Python for NuSTAR Timing [ascl:<a href="http://ascl.net/1502.021">1502.021</a>], is a set of Python (2.7, 3.3, 3.4) scripts designed to perform correctly and fairly easily a quick-look timing analysis of <em>NuSTAR</em> (and partially <em>XMM-Newton</em>/EPIC and <em>RXTE</em>/PCA) data.</p>
<p>It employs fairly standard procedures to perform the Fourier analysis of data and calculate periodograms. Data are automatically extracted from Good Time Intervals if specified, in order to avoid the spurious contributions to the periodograms arising from bad intervals.</p>
<p>Also, when data from two detectors are used (like for the two focal planes of <em>NuSTAR</em>) it gives the possibility to calculate the <strong>cospectrum</strong> (the real part of the cross-spectrum). This is necessary for <em>NuSTAR</em> observations of bright sources: in these observations, <strong>dead time</strong> effects produce a distortion in the power spectrum (in particular in the Poisson noise baseline) that is not easy to model and makes it very tricky to calculate the real source periodogram. The cospectrum, by eliminating all correlations between the two detectors, permits to have a noise-subtracted periodogram.</p>
<p>The software is released under the BSD license. It can be downloaded from the two repositories below:</p>
<p>Bitbucket: <a href="https://bitbucket.org/mbachett/maltpynt">https://bitbucket.org/mbachett/maltpynt</a></p>
<p>GitHub: <a href="https://github.com/matteobachetti/MaLTPyNT/">https://github.com/matteobachetti/MaLTPyNT/</a></p>
<p>The documentation is available here: <a href="http://maltpynt.readthedocs.org/">http://maltpynt.readthedocs.org/</a></p>
<p><strong>More information</strong></p>
<p>Indexed in NASA ADS: <a href="http://adsabs.harvard.edu/abs/2015ascl.soft02021B">http://adsabs.harvard.edu/abs/2015ascl.soft02021B</a></p>
<p>ASCL entry: <a href="http://ascl.net/1502.021">http://ascl.net/1502.021</a></p>
<p>Continuous Integration with Travis CI: <a href="https://travis-ci.org/matteobachetti/MaLTPyNT/">https://travis-ci.org/matteobachetti/MaLTPyNT/</a></p> 

import IndexLayout from '../layouts';
import Wrapper from '../components/Wrapper';
import SiteNav from '../components/header/SiteNav';
import {SiteHeader, outer, inner, SiteMain} from '../styles/shared';
import * as React from 'react';
import { css } from '@emotion/core';

import { PostFullHeader, PostFullTitle, NoImage, PostFull } from '../templates/post';
import { PostFullContent } from '../components/PostContent';
import Footer from '../components/Footer';
import Helmet from 'react-helmet';
import orcid from '../content/img/ORCID.png';
console.log(orcid)

const PageTemplate = css`
  .site-main {
    background: #fff;
    padding-bottom: 4vw;
  }
`;

const About: React.FunctionComponent = () => (
  <IndexLayout>
    <Helmet>
      <title>About</title>
    </Helmet>
    <Wrapper css={PageTemplate}>
      <header css={[outer, SiteHeader]}>
        <div css={inner}>
          <SiteNav />
        </div>
      </header>
      <main id="site-main" className="site-main" css={[SiteMain, outer]}>
        <article className="post page" css={[PostFull, NoImage]}>
          <PostFullHeader>
            <PostFullTitle>About</PostFullTitle>
          </PostFullHeader>

          <PostFullContent className="post-full-content">
            <div className="post-content">
                        <p>I'm staff Researcher at the Cagliari Astronomical Observatory, in Italy.</p>
                        <p>
        I study Neutron Stars and Black Holes, the most dense objects known in Astrophysics (and so, generally referred to as compact objects). For example, a neutron star packs 1.5 times the mass of the Sun in about 20 km; a black hole of 3 times the mass of the Sun can be even smaller!
        </p>
        <p>
I'm particularly interested in the measurements we can obtain of these objects (their mass, their dimensions, their magnetic fields where relevant) by looking at their X-ray signals. These are usually produced during a process called accretion, when matter from a nearby star is captured by the compact object, and is heated up to millions of degrees while approaching it. This very hot matter emits most of its luminosity in the X-rays. I'm also interested in the study of the same sources from their signals in the radio band, since accretion is known to produce emission in a wide range of wavelengths.
</p>
        <p>
I'm in the Science Team and the Science Commissioning and Calibration Team of the NuSTAR satellite, in the Astronomical Validation Team of the Sardinia Radio Telescope, in the Instrument team of the future IXPE SMEX mission and in the Advanced Software team for Athena/X-IFU.
</p>
        <p>
In this website you will find more details of my studies, plus something totally unrelated. Enjoy :)
</p>
        <p>
-Matteo
          </p>
          <img src={orcid} style={{width: '100px'}} alt="Orcid" />
            </div>
          </PostFullContent>
        </article>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default About;

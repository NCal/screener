import React from 'react';
import { Link } from 'react-router-dom';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render = () => {
    return (
      <div className="App">
        <Link to={'/'}>
          <span style={{ position: 'absolute', top: '10px', left: '10px' }}>
            Home
          </span>
        </Link>
        <h3>TERMS OF USE 🔑</h3>
        <h4>Limits</h4>
        <p>
          You acknowledge and agree that ScreenGrab imposes a limit on the
          size and the number of requests you may send to the Service.
          ScreenGrab may change such limits at any time, at ScreenGrab’s
          sole discretion.
        </p>
        <h4>Responsibility</h4>
        <p>
          You represent and warrant that: your use of the Service will not
          infringe the proprietary rights, including but not limited to the
          copyright, patent, trademark or trade secret rights, of any third
          party; content you submit does not contain or install any viruses,
          worms, malware, Trojan horses or other harmful or destructive
          content; you will not use the Service in any manner that may
          disable, damage or overburden it; your use of the Service will be
          in strict accordance with this Agreement and with all applicable
          laws and regulations (including without limitation any local laws
          or regulations in your country, state, city, or other governmental
          area). ScreenGrab in its sole discretion has the right (though not
          the obligation) to refuse or remove content, terminate any
          subscription, and deny or limit access to use of the Service to
          any individual or entity if the terms of this Agreement are
          violated.
        </p>
        <h4>Privacy</h4>
        <p>
          At ScreenGrab we take your privacy seriously. Only a minimum of
          personal information is collected and used in order to administer
          your account and to provide you the requested products and
          services. Privacy, protection and data security are at the very
          heart of everything we do. ScreenGrab is GDPR ready and compliant.
          If you would like to review, correct, or update your personal
          data, you may do so by signing in to your account dashboard or by
          contacting ScreenGrab support representatives. ScreenGrab only
          processes personal data that is required to provide the Service to
          you. You have the right to data portability, right to access and
          right to be forgotten. Personal data stored in your account will
          be deleted upon request.
        </p>
        <h4>Data processing</h4>
        <p>
          operations Images uploaded to the Service are temporarily stored,
          optimized and deleted within 24 hours. Requests to the Service can
          be logged in order to understand how the Service is used and to
          avoid misuse. A log entry contains information such as browser
          type, IP address, any API key, date, time, and fingerprint of the
          transferred file.
        </p>
        <h4>Disclaimer of warranties</h4>
        <p>
          The Service is provided “as is”. Screengrab and its suppliers and
          licensors hereby disclaim all warranties of any kind, express or
          implied, including, without limitation, the warranties of
          merchantability, fitness for a particular purpose and
          non-infringement. Neither Screengrab nor its suppliers and
          licensors, make any warranty that the Service will be error free
          or that access thereto will be continuous or uninterrupted. You
          understand that you download from, or otherwise obtain content or
          services, through the Service at your own discretion and risk.
        </p>
        <h4>Limitation of liability</h4>
        <p>
          In no event will Screengrab, or its suppliers or licensors, be
          liable with respect to any subject matter of this Agreement under
          any contract, negligence, strict liability or other legal or
          equitable theory for: (i) any special, incidental or consequential
          damages; (ii) the cost of procurement for substitute products or
          services; (iii) for interruption of use or loss or corruption of
          data; or (iv) for any amounts. Screengrab shall have no
          liability for any failure or delay due to matters beyond their
          reasonable control. The foregoing shall not apply to the extent
          prohibited by applicable law.
        </p>
        <h4>Indemnification</h4>
        <p>
          You agree to indemnify and hold harmless Screengrab, its
          contractors, and its licensors, and their respective directors,
          officers, employees and agents from and against any and all claims
          and expenses, including attorneys’ fees, arising out of your use
          of the Service, including but not limited to your violation of
          this Agreement.
        </p>
        <h4>Changes</h4>
        <p>
          ScreenGrab reserves the right to modify or replace any part of
          this Agreement at any time. Your continued use of the Service
          following the posting of any changes to this Agreement constitutes
          acceptance of those changes. This Agreement may only be modified
          by a written amendment signed by an authorized executive of
          ScreenGrab, or by the posting by ScreenGrab of a revised version.
        </p>
        <h4>Applicable law and jurisdiction</h4>
        <p>
          Except to the extent applicable law, if any, provides otherwise
          this Agreement, any access to or use of the Service will be
          governed by the laws of the state of NY, USA excluding its
          conflict of law provisions, and the proper venue for any disputes
          arising out of or relating to any of the same will be the courts
          located in the USA. If any part of this Agreement is
          held invalid or unenforceable, that part will be construed to
          reflect the parties’ original intent, and the remaining portions
          will remain in full force and effect.
        </p>
        <h4>Entire agreement</h4>
        <p>
          Entire agreement This Agreement constitutes the entire agreement
          between ScreenGrab and you concerning the subject matter hereof.
        </p>
      </div>
    );
  };
}

export default About;

import { MessageDisplay } from 'components/common';
import { useDocumentTitle, useFeaturedProducts, useScrollTop } from 'hooks';
import ReactGA from 'react-ga';
import React from 'react';
import { HEADLINE_OFFER } from 'constants/constants';

const Story = () => {
  useDocumentTitle('Our Story | Pilk');
  useScrollTop();

  ReactGA.pageview("/our-story")

  return (
    <main className="content">
      <div className="notification-top-bar">
      <p>{HEADLINE_OFFER}</p>
			</div>
      <div className='container-fluid'>
      <div className="story-title row justify-content-center">
            <h1>Our Story</h1>
            </div>
            <div className='row story'>
              <div className='col-md-6'>
                <img src="https://firebasestorage.googleapis.com/v0/b/pilk-1.appspot.com/o/kanishknRai-min.png?alt=media&token=0ad2c921-44d0-420a-9784-9cbd2a5af726" />
                <div className='row'>
                <div className='col-md-6 col-6'><a href = "https://www.linkedin.com/in/thenameisrai/" target="_blank"><h3>Abhishek Kumar</h3></a>  </div>
                <div className='col-md-6 col-6'><a href = "https://www.linkedin.com/in/kanishk-gupta-08/" target="_blank"><h3>Kanishk Gupta</h3></a> </div>
                </div>
              </div>
              <div className='col-md-6'>

              <p>Hello everyone !! <br/><br/>

We are the brains behind Pilk and we are here to give you the best experience of a plant based lifestyle. 
<br/><br/>
Our journey started in a quite dramatic way. We both happened to watch a documentary - "The Game Changers" in Oct’ 19 and to say the least, it turned our life upside down. It changed our perspective on food, particularly plant based foods and how athletes around the world are increasing strength and improving their game by going plant-based. We did more research and found how terrible the entire animal agriculture was for everyone, be it us or the planet or animals. 
<br/><br/>
We started switching all animal based products by plant based counterparts but soon found the dairy alternatives available were not good. The quest to have the best plant-based milk which can truly replace dairy gave birth to ‘Pilk’. 
<br/><br/>
After over a year of dedicated research and infinite trials with the help of researchers and innovators from reputed colleges like ‘ICT, Mumbai’  and other best known food techs, we are able to bring the ‘Pilk’ in it’s current form. We wish to get your love and support to keep on growing towards our mission of creating a complete plant-based ecosystem.
<br/><br/>
Cheers !!!
</p>
    
              </div>
            </div>
          </div>
          
    </main>
  );
};

export default Story;

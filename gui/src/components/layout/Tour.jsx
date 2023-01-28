import JoyRide from 'react-joyride'

// Tour steps
const TOUR_STEPS = [
  {
    target: '.tour-logo',
    content: 'This is the App logo',
  },
  {
    target: '.tour-login',
    content: 'View the login button',
  },
  {
    target: '.tour-post',
    content: 'here is the post card',
  },
  {
    target: '.tour-contact',
    content: 'this is the contact form',
  },
  {
    target: '.tour-footer',
    content: 'see our footer',
  },
]

// Tour component
const Tour = () => {
  return (
    <>
      <JoyRide steps={TOUR_STEPS} continuous={true} showSkipButton={true} />
    </>
  )
}
export default Tour

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react'
import { Text, IStackTokens, Stack, ActionButton, IIconProps, VerticalDivider } from '@fluentui/react'
import '../Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authContext, authProvider } from '../Auth/AuthProvider'
import Navigation from './Navigation'

// Global context
// import { navBarContext } from '../NavBar/NavBar.Context'
// import { useMenu } from '../NavBar/NavBar.Hook'
// import { NIL } from 'uuid';

const stackTokens: IStackTokens = { childrenGap: 20 };
const signIcon: IIconProps = { iconName: 'SignIn' };

const Rules: React.FC = () => {

  // Get Auth Context
  const authUserContext = useContext(authContext)
  
  return (
    <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm1 ms-xl1">
            <Navigation selectedKey="rules" />
          </div>
          <Stack tokens={stackTokens} verticalAlign="end">
            <Stack.Item align="end">
              <Text className="Header">{authUserContext.authUser.displayName ?? 'Anonymous'}</Text>
              <ActionButton className="button" text={authUserContext.authUser.isSigned ? 'Sign Out' : 'Sign In'} 
              iconProps={signIcon} allowDisabledFocus disabled={false} checked={false} onClick={authUserContext.onSignInOutClicked} />
            </Stack.Item>
            <Stack verticalAlign="stretch">
              <Text variant={'xxLarge'} block>
                  Instructions
                </Text>
              <div className="Rules">
                <VerticalDivider />
                <br/>
                <ul className="list-content">
                <li>Please use the MATCH CLOCK (in the video footage), not the video timer</li>
                <li>Rate something as significant if:</li>
                <li>Penetration (pass)
                  <ul className="list-subcontent">
                  <li>A defensive line is broken,</li>
                  <li>AND the player receiving the ball is in an advantageous position to attack the next line (i.e. in space),</li>
                  <li>AND the pass took more than routine skill/vision</li>
                  </ul>
                </li>
                <li>Penetration (dribble)
                  <ul className="list-subcontent">
                    <li>A defensive line is broken,</li>
                    <li>The player dribbles into an advantageous position to attack the next line (i.e. in space),</li>
                    <li>AND the dribble took more than routine skill/vision</li>
                  </ul>
                </li>
                <li>Possession
                  <ul className="list-subcontent">
                    <li>A player wins possession from the opposition,</li>
                    <li>AND won the ball from an unfavourable position (i.e. less than 50/50)</li>
                  </ul>
                </li>
                <li>Disruption
                  <ul className="list-subcontent">
                    <li>A player uses a higher than expected or routine level of anticipation or skill to delay or disrupt an attack (even if possess ion is
  not won)</li>
                  </ul>
                </li>
                <li>Error
                  <ul className="list-subcontent">
                    <li>A player makes an error that leads to a significant penetration for the other team</li>
                    <li>And the error is a consequence of below expected skill execution (relative to English Premier League)</li>
                  </ul>
                </li>
                <li>Run - A player makes a skillful, well timed, or motivated run to:
                  <ul className="list-subcontent">
                    <li>Give a team mate an option AND receive a pass</li>
                    <li>Give a team mate an option AND drag an opposition player out of position</li>
                    <li>Intercept a pass</li>
                  </ul>
                </li>
                </ul>
              </div>
            </Stack>
          </Stack>
        </div>
    </div>      
  )
}

export default Rules

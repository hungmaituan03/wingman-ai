import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

import { useTripStorage } from '../hooks/useTripStorage'
import TripPlanner from '../screens/Trip/TripPlanner'
import TripResults from '../screens/Trip/TripResults'
import TripDrawer from '../components/Trip/Header/TripDrawer'

const Drawer = createDrawerNavigator()
const Stack = createNativeStackNavigator()

function TripAppNavigator({ initialTrip, onTripSubmit, onNewTrip }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TripPlanner">
        {props => (
          <TripPlanner
            {...props}
            initialTrip={initialTrip}
            onTripSubmit={onTripSubmit}
            onNewTrip={onNewTrip}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="TripResults">
        {props => (
          <TripResults
            {...props}
            trip={props.route.params}
            onNewTrip={onNewTrip}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export default function TripStack() {
  const navigation = useNavigation()
  const { tripList, saveTrip, deleteTrip } = useTripStorage()

  // The very last‐saved session
  const initialTrip =
    tripList.length > 0 ? tripList[tripList.length - 1] : null

  const handleTripSubmit = async data => {
    const session = { ...data, id: data.conversation_id }
    await saveTrip(session)
    navigation.navigate('Trip', {
      screen: 'TripApp',
      params: {
        screen: 'TripResults',
        params: session,
      },
    })
  }

  const handleNewTrip = () => {
    navigation.navigate('Trip', {
      screen: 'TripApp',
      params: { screen: 'TripPlanner' },
    })
  }

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={props => (
        <TripDrawer
          {...props}
          tripHistory={tripList}
          onSelectTrip={option => {
            if (option.delete) {
              // swipe-to-delete
              deleteTrip(option.id)
            } else if (option.view) {
              // open an existing session
              props.navigation.navigate('TripApp', {
                screen: 'TripResults',
                params: option.trip,
              })
            }
            props.navigation.closeDrawer()
          }}
          onNewTrip={() => {
            handleNewTrip()
            props.navigation.closeDrawer()
          }}
        />
      )}
    >
      <Drawer.Screen name="TripApp">
        {() => (
          <TripAppNavigator
            initialTrip={initialTrip}
            onTripSubmit={handleTripSubmit}
            onNewTrip={handleNewTrip}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
}

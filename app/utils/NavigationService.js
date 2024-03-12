let _navigator

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(name, params) {
  _navigator?._navigation?.navigate(name, params)
}

// function push(name, params) {
  // _navigator.dispatch(StackActions.push(name, params))
// }

// function reset(resetAction) {
  // _navigator.dispatch(resetAction)
// }

function goBack() {
  _navigator?._navigation?.goBack();
}

// export function getParams(props) {
//   return props.route.params || {}
// }

// export function resetActionTo(screen) {
  // const resetAction = CommonActions.reset({
  //   index: 1,
  //   routes: [{ name: screen }],
  // })
  // _navigator.dispatch(resetAction)
// }

// export function replace(name, params) {
  // _navigator.dispatch(
  //   StackActions.replace({
  //     name,
  //     params,
  //   }),
  // )
// }

// gets the current screen from navigation state
// export function getActiveRouteName(navigationState) {
  // if (!navigationState) {
  //   return null
  // }
  // const { index } = navigationState
  // const route = navigationState.routes[index]
  // // dive into nested navigators
  // if (route.routes) {
  //   return getActiveRouteName(route)
  // }
  // const child = route.state
  // if (child) {
  //   const indexChild = child.index
  //   const routeChild = child.routes[indexChild]
  //   if (routeChild.routes) {
  //     return getActiveRouteName(route)
  //   }
  //   return routeChild.name
  // }
  // return route.name
// }

// add other navigation functions that you need and export them
const NavigationServices = {
  navigate,
  goBack,
  setTopLevelNavigator,
  // reset,
  // resetActionTo,
  // replace,
  // push,
}
export default NavigationServices

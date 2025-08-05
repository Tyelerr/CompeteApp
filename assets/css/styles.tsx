import { StyleSheet } from "react-native";
import { BaseColors, BasePaddingsMargins, TextsSizes } from "../../hooks/Template";




export const StyleZ = StyleSheet.create({

  colors: {
    backgroundColor: BaseColors.backgroundColor,
    color: BaseColors.othertexts
  },

  test: {
    // color: 'yellow', view can't have color :)
    backgroundColor: 'red',
  },
  testText: {
    color: 'yellow'
  },

  hr:{
    borderBottomColor: BaseColors.secondary,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
  },

  headerTitleStyle:{
    fontWeight: 700,
    fontSize: 25,
    color: BaseColors.title
  },
  headerSubtitleStyle:{
    fontSize: 16,
    color: BaseColors.othertexts,
    // color: 
  },
  h1:{},
  h2:{
    fontSize: TextsSizes.h2,
    color: BaseColors.light,
    fontWeight: 'bold',
    marginBottom: BasePaddingsMargins.m15
  },
  h3:{
    fontSize: TextsSizes.h3,
    color: BaseColors.light,
    fontWeight: 'bold',
    marginBottom: BasePaddingsMargins.m15
  },
  h4:{
    // color: BaseColors.othertexts,
    fontSize: TextsSizes.h4,
    fontWeight: '600',
    color: BaseColors.light,
  },
  h5:{
    // color: BaseColors.othertexts,
    fontSize: TextsSizes.h5,
    fontWeight: '600',
    color: BaseColors.light,
  },
  p:{
    fontSize: TextsSizes.p,
    lineHeight: 1.3*TextsSizes.p,
    color: BaseColors.othertexts
  },

  contentSwitcherButton:{
    color: BaseColors.light,
    backgroundColor: BaseColors.contentSwitcherBackgroundCOlor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: 12,
    paddingBlock: 6,
    borderRadius: 4,
    fontSize: 12
  },
  contentSwitcherButtonActive:{
    backgroundColor: BaseColors.primary,
    color: BaseColors.light
  },

  tabBarIcon:{
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    paddingInline: 10,
    paddingBlock: 5,
    marginBottom: 0,
    borderRadius: 10,
    width: 40
  },

  loginFormHeading: {
    width: '100%',
    marginBottom: BasePaddingsMargins.sectionMarginBottom
  },
  loginFromContainer: {
    // no height or minheight in scroll view
    // height: '100%',
    // minHeight: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // flexWrap:'wrap',
    flex: 1,
    // borderStyle: 'dotted',
    // borderWidth: 4,
    // borderColor: 'white',
    // paddingTop: 50,
    // paddingBottom: 20
  },
  loginForm: {
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: 320
  },
  loginFormInput:{
    color: BaseColors.othertexts,
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: BaseColors.othertexts,
    // borderColor: 'red',
    borderWidth: 1,
    width: '100%',
    paddingBlock: BasePaddingsMargins.m10,
    paddingHorizontal: 15, //only add to horisontal values
    // paddingVertical: 50,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    // paddingInline: 10,
    // paddingBlock: 5
    fontSize: TextsSizes.p,
    // minHeight: 30,

  },
  loginFormInput_Textarea:{
    minHeight: 70
  },

  loginFormInputHolder:{
    width: '100%',
    marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
  },
  loginFormInputHolder_onlyRead:{
    pointerEvents: 'none',
    //backgroundColor: BaseColors.secondary,
  },
  loginFormInput_onlyRead:{
    backgroundColor: BaseColors.secondary,
    borderWidth: 0,
  },

  loginFormInputLabel:{
    color: BaseColors.othertexts,
    width: '100%',
    display: 'flex',
    marginBottom: 5
  },

  LFButtonContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: BasePaddingsMargins.loginFormInputHolderMargin,
    width: '100%'
  },
  LFBUtton:{
    backgroundColor: 'silver',
    // color: 'black',
    // color: 'red',
    fontSize: 15,
    display: 'flex',
    paddingInline: 15,
    paddingBlock: 14,
    borderRadius: 5,
    // width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    textAlign: 'center',
  },
  LFBUtton_Small:{
    fontSize: 15,
    paddingInline: 3,
    paddingBlock: 10,
  },
  LFBUtton_Bigger:{
    fontSize: TextsSizes.h1,
    paddingInline: 15,
    paddingBlock: 10,
  },
  /*LFButton_DefaultSize:{

  },*/
  
  /// Different styles start
  LFButtonPrimary:{
    color: BaseColors.light,
    backgroundColor: BaseColors.primary
  },
  LFButtonPrimaryPressed:{
    backgroundColor: BaseColors.primaryPressed
  },
  LFButtonOutlineDark:{
    color: BaseColors.light,
    backgroundColor: BaseColors.dark,
    borderWidth: 1,
    borderColor: BaseColors.PanelBorderColor,
    borderStyle: 'solid',
  },
  LFButtonOutlineDarkPressed:{
    backgroundColor:BaseColors.PanelBorderColor
  },
  /*LFButtonOutlineSecondary:{
    color: BaseColors.light,
    backgroundColor: BaseColors.sec,
  },*/
  LFButtonDanger:{
    backgroundColor: BaseColors.danger,
    color: BaseColors.light,
  },
  LFButtonDangerPressed:{
    backgroundColor: BaseColors.dangerPressed,
  },
  LFButtonDark:{
    color: BaseColors.light,
    backgroundColor: BaseColors.dark
  },
  LFButtonSecondary:{
    color: BaseColors.light,
    backgroundColor: BaseColors.secondary,
  },
  LFButtonSuccess:{
    color: BaseColors.light,
    backgroundColor: BaseColors.success
  },
  /// Different styles start end
  LFForgotPasswordLink_Container:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  LFForgotPasswordLink:{
    color: BaseColors.othertexts,
    fontWeight: 'bold'
  },
  LFErrorMessage:{
    color: '#DC3545',
    display: 'flex',
    paddingTop: 5,
    width: '100%',
  },
  LFErrorMessage_addon_centered:{
    justifyContent: 'center',
    textAlign:'center',
    flexWrap: 'wrap',
    marginBottom: BasePaddingsMargins.sectionMarginBottom,
    maxWidth: 250
  }

});

export const StylePanel = StyleSheet.create({
  defaultStyle:{
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BaseColors.PanelBorderColor,
    padding: BasePaddingsMargins.m20,
    marginBottom: BasePaddingsMargins.m30
  },
  ForCalendar:{
    padding: BasePaddingsMargins.m10 ,
    marginBottom: 0
  }
});

export const StyleBadge = StyleSheet.create({
  defaultStyle: {
    backgroundColor: BaseColors.dark,
    
    borderStyle: 'solid',
    borderColor: BaseColors.secondary,
    borderWidth: 1,

    borderRadius: 15,
    paddingInline: 20,
    paddingBlock: 5,
    display: 'flex',
    justifyContent: 'center',
    width: 'auto',
  },

  sizeSmall: {
    paddingInline: 8,
    fontSize: TextsSizes.small,
  },

  defaultTextStyle: {
    fontSize: TextsSizes.p,
    color: BaseColors.light,
    textAlign: 'center',
    width: '100%'
  },
  secondary: {
    backgroundColor: BaseColors.secondary,
    borderColor: BaseColors.secondary
  },
  primary: {
    backgroundColor: BaseColors.primary,
    borderColor: BaseColors.primary
  },
  secondaryText:{
    color: BaseColors.light
  },
  primaryText:{
    color: BaseColors.light
  },
  primaryOutline:{
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: BaseColors.primary
  },
  primaryOutlineText:{
    color: BaseColors.primary
  }
});

export const StyleModal = StyleSheet.create({
  container:{
    // backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.7)',
    width: '100%'
  },
  containerForScrollingView:{
    // flex: 1,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 320,
    backgroundColor: BaseColors.dark,
    position: 'relative'
  },
  scrollView:{
    // padding: 25,
    paddingInline: 16,
    // flex: 1,
    // backgroundColor: 'yellow'
    // borderWidth:3,
    // borderColor: 'green',
    // height: 200,
    height: '100%',
    maxHeight: '100%',
  },
  headingContainer:{
    marginBottom: BasePaddingsMargins.m20
  },
  heading:{
    fontSize: TextsSizes.h3,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
    color: BaseColors.light
  },
  contentView:{
    width: '100%',
    // borderWidth: 1,
    // padding: 25,
    paddingBlock: 25,
    // backgroundColor: 'silver',
    // borderWidth:3,
    // borderColor: 'yellow'
  },
  closeButtonContainer:{
    position: 'absolute',
    right: -15,
    top: 0,
    width: 60,
    height: 50,
    justifyContent: 'center',
    zIndex: 100000,
  },

  ModalInfoMessageContainer:{
    width: 250,
    backgroundColor: BaseColors.dark,
    padding: BasePaddingsMargins.m15,
    borderWidth: 1,
    borderColor: BaseColors.secondary,
    borderStyle: 'solid',
    borderRadius: 5
  },

  backgroundTouchableForClosing:{
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    // backgroundColor: 'green',
    display: 'flex' 
  }
});


export const StyleZTable = StyleSheet.create({
  container:{},
  header:{},
  headerTexts:{
    color: BaseColors.othertexts,
    fontSize: TextsSizes.p,
    fontWeight: 'bold'
  },
  row:{
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
  cell:{
    paddingInline: 7,
    paddingBlock: 7
  },
  cellFirst:{
    paddingLeft: 0
  },
  cellLast:{
    paddingRight: 0
  },
  cellCentered:{
    alignItems: 'center',
    justifyContent: 'center'
  }
});


export const StyleGoogle = StyleSheet.create({
  searchVenue_Container:{
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: BaseColors.othertexts,
    marginBottom: BasePaddingsMargins.loginFormInputHolderMargin
  },
  searchVenue_ScrollView:{
    /*borderStyle: 'solid',
    borderWidth: 1,
    borderColor: BaseColors.othertexts,
    borderRadius: 5,
    padding: BasePaddingsMargins.m10*/
  },
  searchVenue_ItemContainer:{
    backgroundColor: BaseColors.secondary,
    marginBottom: BasePaddingsMargins.m10,
    paddingBlock: BasePaddingsMargins.m5,
    paddingInline: BasePaddingsMargins.m15,
    borderRadius: BasePaddingsMargins.m10
  },
  searchVenue_ItemText:{
    color: BaseColors.light,
    fontSize: TextsSizes.p
  }
});



export const StyleTournamentsAdmin = StyleSheet.create({
  p:{
    color: BaseColors.othertexts,
    fontSize: TextsSizes.p,
    marginBottom: BasePaddingsMargins.m5
  },
  title:{
    color: BaseColors.light,
    fontSize: TextsSizes.h4,
    fontWeight: 'bold',
    marginBlock: BasePaddingsMargins.m15
  },
  titleV2:{
    marginTop: 0
  },
  image:{
    borderRadius: 10,
    width: '100%', 
    height: 200,
    backgroundColor: BaseColors.secondary
  },
  imageSmall:{
    height: 100
  },
  badgesHolder:{
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  badgeHolder:{
    marginRight: BasePaddingsMargins.m10,
    marginBottom: BasePaddingsMargins.m15
  }
});



export const StyleTournamentAnalytics = StyleSheet.create({
  
  container:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  cellTrophy:{
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: BasePaddingsMargins.m5
  },
  cellTexts:{},
  n:{
    color: BaseColors.light,
    fontSize: TextsSizes.h1,
    fontWeight: 'bold'
  },
  p:{
    color: BaseColors.othertexts,
    fontSize: TextsSizes.p
  },
  icon:{
    color: BaseColors.light,
    fontSize: TextsSizes.h1,
  },

  TitleAnalyiticsBig:{
    fontSize: TextsSizes.h3,
    color: BaseColors.light,
    fontWeight: 'bold',
    marginBottom: BasePaddingsMargins.formInputMarginLess
  },

  ItemTexts:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: BasePaddingsMargins.formInputMarginLess
  },
  ItemTexts_Cell1:{
    width: '65%'
  },
  ItemTexts_Cell2:{
    width: '33%'
  },
  ItemTexts_Title:{
    color: BaseColors.light,
    fontSize: TextsSizes.p,
    fontWeight: 'bold'
  },
  ItemTexts_Value:{
    color: BaseColors.light,
    fontSize: TextsSizes.h4,
    fontWeight: 'bold',
    textAlign: 'right'
  }

});



export const StyleProgress = StyleSheet.create({
  container: {
    backgroundColor: BaseColors.secondary,
    position: 'relative',
    height: BasePaddingsMargins.m10,
    borderRadius: .5*BasePaddingsMargins.m10,
  },
  progress:{
    backgroundColor: BaseColors.primary,
    left: 0,
    top: 0,
    width: '0%',
    height: BasePaddingsMargins.m10,
    borderRadius: .5*BasePaddingsMargins.m10
  }
});


export const StyleSlider = StyleSheet.create({
  container_main:{
    marginBottom: BasePaddingsMargins.formInputMarginLess
  },
  titleContainer:{
    marginBottom: BasePaddingsMargins.m10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  title:{
    fontSize: TextsSizes.p,
    color: BaseColors.light,
    fontWeight: 'bold'
  },
  singleValue:{
    fontSize: TextsSizes.p,
    color: BaseColors.light,
    fontWeight: 'bold'
  },
  footer_measures:{
    marginTop: BasePaddingsMargins.m5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footer_measures_text:{
    color: BaseColors.othertexts,
    fontSize: TextsSizes.small
  }
});



export const StyleThumbnailSelector = StyleSheet.create({
  thumb:{
    position: 'relative',
    width: 136,
    height: 136,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: BaseColors.othertexts,
    borderStyle: 'solid',
    backgroundColor: BaseColors.secondary,
    borderRadius: 10,
    marginBottom: BasePaddingsMargins.m10,
    marginRight: BasePaddingsMargins.m10,
  },
  thumb_file:{
    borderStyle: 'dotted'
  },
  thumb_active:{
    borderColor: BaseColors.primary,
    borderWidth: 4
  },
  image:{
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  }
});
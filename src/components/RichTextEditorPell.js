/**
 * Rich Editor Example
 * @author tangzehua
 * @since 2019-06-24 14:52
 */
import React from 'react';
import {
  Appearance,
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import colors from '../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

// const initHTML = `<br/>
// <center><b>Pell.js Rich Editor</b></center>
// <center>React Native</center>
// <br/>
// <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" ></br></br>
// </br></br>
// `;

class RichTextEditorPell extends React.Component {
  richText = React.createRef();

  constructor(props) {
    super(props);
    const that = this;
    const theme = props.theme || Appearance.getColorScheme();
    const contentStyle = that.createContentStyle(theme);
    that.state = {theme: theme, contentStyle, initHTML: ''};
    that.onHome = that.onHome;
    that.save = that.save;
    that.onTheme = that.onTheme;
    that.onPressAddImage = that.onPressAddImage;
    that.onInsertLink = that.onInsertLink;
    that.themeChange = that.themeChange;
  }

  componentDidMount() {
    Appearance.addChangeListener(this.themeChange);
    this.props.getRefEditor(this.richText);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.chatText !== this.props.chatText && this.props.chatText) {
      this.setContentHTML(this.props.chatText);
      // this.save();
    }
    // if (
    //   prevProps.timeTextChange !== this.props.timeTextChange &&
    //   this.props.timeTextChange
    // ) {
    //   this.save();
    // }

    // if (
    //   prevProps.chatTextClear !== this.props.chatTextClear &&
    //   this.props.chatTextClear
    // ) {
    //   this.setContentHTML('');
    // }
  }

  componentWillUnmount() {
    Appearance.removeChangeListener(this.themeChange);
  }

  /**
   * theme change to editor color
   * @param colorScheme
   */
  themeChange({colorScheme}) {
    const theme = colorScheme;
    const contentStyle = this.createContentStyle(theme);
    this.setState({theme, contentStyle});
  }

  async save() {
    // Get the data here and call the interface to save the data
    let html = await this.richText.current?.getContentHtml();
    this.props.getChatText(html);
  }

  async setContentHTML(chatText) {
    await this.richText.current?.setContentHTML(chatText);
  }

  onPressAddImage() {
    // insert URL
    this.richText.current?.insertImage(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png',
    );
    // insert base64
    // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
    this.richText.current?.blurContentEditor();
  }

  onHome() {
    this.props.navigation.push('index');
  }

  createContentStyle(theme) {
    const contentStyle = {
      backgroundColor: colors.colorMidnightBlue,
      color: colors.white,
      placeholderColor: 'gray',
    };
    if (theme === 'light') {
      contentStyle.backgroundColor = colors.white;
      contentStyle.color = colors.colorMidnightBlue;
      contentStyle.placeholderColor = colors.colorSilver;
    }
    return contentStyle;
  }

  onTheme() {
    let {theme} = this.state;
    theme = theme === 'light' ? 'dark' : 'light';
    let contentStyle = this.createContentStyle(theme);
    this.setState({theme, contentStyle});
  }

  render() {
    let that = this;
    const {contentStyle, theme, initHTML} = that.state;
    const {backgroundColor, color, placeholderColor} = contentStyle;
    const themeBg = {backgroundColor};
    return (
      <SafeAreaView style={[styles.container, themeBg]}>
        <ScrollView
          style={[styles.scroll, themeBg]}
          keyboardDismissMode={'none'}>
          <RichEditor
            editorStyle={contentStyle}
            containerStyle={themeBg}
            ref={that.richText}
            style={[styles.rich, themeBg]}
            placeholder={'please input content'}
            initialContentHTML={initHTML}
            onChange={text => this.props.onChangeEditorText(text)}
          />
        </ScrollView>
        <KeyboardAvoidingView behavior={'padding'}>
          <RichToolbar
            style={[
              styles.richBar,
              themeBg,
              {backgroundColor: colors.colorWhisper},
            ]}
            editor={that.richText}
            iconTint={color}
            iconSize={45}
            selectedIconTint={colors.colorDeepSkyBlue}
            selectedButtonStyle={{backgroundColor: 'transparent'}}
            onPressAddImage={that.props.doumentPicker}
            onInsertLink={that.props.onInsertLink}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorAliceBlue,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '5rem',
  },
  rich: {
    minHeight: '300rem',
    flex: 1,
  },
  richBar: {
    height: '50rem',
    backgroundColor: colors.colorAliceBlue,
  },
  scroll: {
    backgroundColor: colors.white,
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.colorWhisper,
    flexDirection: 'row',
    height: '40rem',
    alignItems: 'center',
    paddingHorizontal: '15rem',
  },

  input: {
    flex: 1,
  },
});

export default RichTextEditorPell;

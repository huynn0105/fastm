import React, { PureComponent } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import HTML from 'react-native-render-html';

import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import ImageButton from '../ImageButton';
import AppText from '../../componentV3/AppText';

const htmlContent = `<ul>
<li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li>
<li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>
<li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>
<li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li>
</ul>`;

export class FormPolicy extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPolicyCheckBoxSelected: false,
      showError: false,
    };
  }

  componentDidMount() {
    if (this.props.formPolicyRef) {
      this.props.formPolicyRef(this);
    }
  }

  onReadMoreTermPress = () => {
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Điều khoản sử dụng',
      url: this.props.termsOfUsageUrl,
    });
  };


  onReadMorePolicyPress = () => {
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Chính sách bảo mật',
      url: this.props.policyURL,
    });
  };


  isFormPolicyValid = () => this.state.isPolicyCheckBoxSelected;

  validateFormPolicy = () => {
    const isValid = this.isFormPolicyValid();
    this.setState({
      showError: !isValid,
    });
    return isValid;
  };

  renderPolicyContent = (policyHTMLContent) => {
    return (
      <ScrollView style={styles.policyContent} nestedScrollEnabled>
        <HTML
          listsPrefixesRenderers={{
            ul: () => {
              return (
                <AppText style={{ color: Colors.primary4, opacity: 0.6, fontSize: 12 }}>{'-    '}</AppText>
              );
            },
          }}
          html={policyHTMLContent}
        />
      </ScrollView>
    );
  };

  renderPolicyCheckBox = () => {
    const { onSelectPolicyCheckBox, policyHTMLContent } = this.props;
    const { isPolicyCheckBoxSelected, showError } = this.state;

    let tickIcon = isPolicyCheckBoxSelected
      ? require('./img/ic_check_on.png')
      : require('./img/ic_check_off.png');

    if (showError) tickIcon = require('./img/ic_check_error.png');

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 12,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <ImageButton
          imageSource={tickIcon}
          onPress={() => {
            this.setState({
              isPolicyCheckBoxSelected: !isPolicyCheckBoxSelected,
              showError: false,
            });
            onSelectPolicyCheckBox(!isPolicyCheckBoxSelected);
          }}
        />
        {/* <HTML
          html={policyHTMLContent}
        /> */}
        <AppText
          style={{
            ...TextStyles.normalTitle,
            marginLeft: 6,
            marginRight: 6,
            color: showError ? Colors.accent3 : `${Colors.primary4}44`,
          }}
        >
          {'Tôi đã đọc và đồng ý với các điều khoản trên, cùng với '}
          <AppText
            style={{ ...TextStyles.normalTitle, color: Colors.primary2 }}
            onPress={this.onReadMoreTermPress}
          >
            {' Điều khoản sử dụng '}
          </AppText>
          và 
          <AppText
            style={{ ...TextStyles.normalTitle, color: Colors.primary2 }}
            onPress={this.onReadMorePolicyPress}
          >
            {' Chính sách bảo mật.'}
          </AppText>
        </AppText>
      </View>
    );
  };

  render() {
    const { containerStyle, policyHTMLContent } = this.props;
    return (
      <View style={{ ...containerStyle }}>
        {this.renderPolicyContent(policyHTMLContent)}
        {this.renderPolicyCheckBox()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  policyContent: {
    padding: 8,
    paddingTop: 0,
    paddingBottom: 8,
    borderRadius: 6,
    backgroundColor: Colors.neutral5,
    minHeight: 150,
    maxHeight: 150,
  },
});

export default FormPolicy;

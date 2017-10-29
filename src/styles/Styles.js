import { Dimensions, StyleSheet } from 'react-native';

class Styles {
  getFooterStyle() {
    let height = 60;

    return StyleSheet.create({
      footer: {
        height: height,
        width: Dimensions.get('window').width,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#2E2E2E'
      },
      button: {
        width: height * 0.7,
        height: height * 0.7,
        justifyContent: 'center',
        alignItems: 'center'
      },
      buttonText: {
        fontSize: 30,
        color: 'white'
      },
      image: {
        width: height,
        height: height,
      },
      songSection: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 15
      },
      songSectionTitle: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold'
      },
      songSectionText: {
        fontSize: 13,
        color: 'white',
      },
      controlSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      },
      progressBar: {
        width: Dimensions.get('window').width - height,
        height: 4,
        backgroundColor: 'gray'
      }
    });
  }
}


let styles = new Styles();

export default styles;
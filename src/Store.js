import {AsyncStorage} from 'react-native';
import {observable} from 'mobx';
import {autobind} from 'core-decorators';
const API_URL = "https://webhook.site/1e72bedb-5ef7-44d9-a6fe-d1ad6022010e"
const API_REQUESTS = "https://webhook.site/token/1e72bedb-5ef7-44d9-a6fe-d1ad6022010e/requests?per_page=200"

@autobind
export default class Store {

  @observable messages = [];
  @observable queueMessages = [];

  sendMessage(messages = {}, rowID = null) {
    this.sendAPIMessage(messages[0].text)
  }

  storeMessages = async () => {
    try {
      await AsyncStorage.setItem('Messages', JSON.stringify(this.messages));
    } catch (error) {
      // Error saving data
    }
  };

  storeQueueMessages = async () => {
    try {
      await AsyncStorage.setItem('QueueMessages', JSON.stringify(this.queueMessages));
    } catch (error) {
      // Error saving data
    }
  };

  retrieveQueueMessages = async () => {
    try {
      const value = await AsyncStorage.getItem('QueueMessages');
      if (value !== null) {
        this.queueMessages = JSON.parse(value);
      }
    } catch (error) {
      // Error saving data
    }
  };

  retrieveMessages = async () => {
    this.getAPIMessages();
    try {
      const value = await AsyncStorage.getItem('Messages');
      if (value !== null) {
        this.messages = JSON.parse(value);
      }
    } catch (error) {
      // Error retrieving data
    }
    setInterval(() => {
      this.getAPIMessages();
   }, 5000);
  };

  async sendAPIMessage(text){
    fetch(API_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: text,
            userid: 'user',
        }),
        }).then((response) => response.json())
            .then((responseJson) => {
            console.log(responseJson.success);
            this.getAPIMessages();
        }).catch((error) => {
            console.log(error);
            this.queueMessages.push({message:text});
            this.storeQueueMessages();
        });
  }

async getAPIMessages() {
    fetch(API_REQUESTS, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        }).then((response) => response.json())
            .then((responseJson) => {
            console.log(responseJson.data);
            const messages = [];
            for (let message of responseJson.data) {
              messages.unshift(this.formatMessage(message));
            }
            this.messages = messages;
            this.storeMessages();
            if(this.queueMessages.length > 0 ){
              for(let queueMessage of this.queueMessages){
                this.sendAPIMessage(queueMessage.message);
                this.queueMessages.shift();
              }
              this.storeQueueMessages();
            }

        }).catch((error) => {
            console.log(error);
        });
  }

formatMessage(message) {
  return {
    _id: message.uuid,
    text: JSON.parse(message.content).message,
    position:  'right',
    createdAt: new Date(message.created_at),
    user: {}
    };
  } 

}
import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { tokenSession } from '../../config/tokenSession.config';
import { WhatsappProfile } from '../model';
import { SenderLayer } from './sender.layer';
import { Scope, checkValuesSender } from '../helpers/layers-interface';

let obj: Scope;

export class RetrieverLayer extends SenderLayer {
  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    super(browser, page, session, options);
  }

  public async getNewMessageId(chatId: string) {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'getNewMessageId';
      const type = 'string';
      const check = [
        {
          param: 'text',
          type: type,
          value: chatId,
          function: typeFunction,
          isUser: true,
        },
      ];
      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }

      const result = await this.page.evaluate(
        (chatId: string) => WAPI.getNewMessageId(chatId),
        chatId
      );

      if (result['erro'] == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }
  /**
   * Returns a list of mute and non-mute users
   * @param type return type: all, toMute and noMute.
   * @returns obj
   */
  public async getListMutes(type?: string): Promise<object> {
    return await this.page.evaluate(
      (type: string) => WAPI.getListMute(type),
      type
    );
  }

  /**
   * Returns browser session token
   * @returns obj [token]
   */
  public async getSessionTokenBrowser(
    removePath?: boolean
  ): Promise<tokenSession> {
    if (removePath === true) {
      await this.page.evaluate(() => {
        window['pathSession'] = true;
      });
    }
    return await this.page.evaluate(() => WAPI.getSessionTokenBrowser());
  }

  /**
   * Receive the current theme
   * @returns string light or dark
   */
  public async getTheme() {
    return await this.page.evaluate(() => WAPI.getTheme());
  }

  /**
   * Receive all blocked contacts
   * @returns array of [0,1,2,3....]
   */
  public async getBlockList() {
    return await this.page.evaluate(() => WAPI.getBlockList());
  }

  /**
   * Retrieves all chats
   * @returns array of [Chat]
   */
  public async getAllChats() {
    return await this.page.evaluate(() => {
      let chats = WAPI.getAllChats();
      return chats;
    });
  }

  /**
   * Retrieves all chats new messages
   * @returns array of [Chat]
   */
  public async getAllChatsNewMsg() {
    return await this.page.evaluate(() => {
      let chats = WAPI.getAllChatsWithNewMsg();
      return chats;
    });
  }

  /**
   * Retrieves all chats Contacts
   * @returns array of [Chat]
   */
  public async getAllChatsContacts() {
    return await this.page.evaluate(() => {
      let chats = WAPI.getAllChats(),
        filter = chats.filter((chat) => chat.kind === 'chat');
      return filter;
    });
  }

  /**
   * Checks if a number is a valid WA number
   * @param contactId, you need to include the @c.us at the end.
   * @returns contact detial as promise
   */
  public async checkNumberStatus(contactId: string): Promise<WhatsappProfile> {
    return await this.page.evaluate(
      (contactId) => WAPI.checkNumberStatus(contactId),
      contactId
    );
  }

  /**
   * Retrieves all chats with messages
   * @returns array of [Chat]
   */
  public async getAllChatsWithMessages(withNewMessageOnly = false) {
    return this.page.evaluate(
      (withNewMessageOnly: boolean) =>
        WAPI.getAllChatsWithMessages(withNewMessageOnly),
      withNewMessageOnly
    );
  }

  /**
   * Retrieve all contact new messages
   * @returns array of groups
   */
  public async getChatContactNewMsg() {
    // prettier-ignore
    const chats = await this.page.evaluate(() => WAPI.getAllChatsWithNewMsg());
    return chats.filter((chat) => chat.kind === 'chat');
  }

  /**
   * Retrieves contact detail object of given contact id
   * @param contactId
   * @returns contact detial as promise
   */
  public async getContact(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.getContact(contactId),
      contactId
    );
  }

  /**
   * Retrieves all contacts
   * @returns array of [Contact]
   */
  public async getAllContacts() {
    return await this.page.evaluate(() => WAPI.getAllContacts());
  }

  /**
   * Retrieves all chats Transmission list
   * @returns array of [Chat]
   */
  public async getAllChatsTransmission() {
    return await this.page.evaluate(() => {
      let chats = WAPI.getAllChats();
      return chats.filter((chat) => chat.kind === 'broadcast');
    });
  }

  /**
   * Retrieves chat object of given contact id
   * @param contactId
   * @returns contact detial as promise
   */
  public async getChatById(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.getChatById(contactId),
      contactId
    );
  }

  /**
   * Retrieves chat object of given contact id
   * @param contactId
   * @returns contact detial as promise
   * @deprecated
   */
  public async getChat(contactId: string) {
    return this.getChatById(contactId);
  }

  /**
   * Retrieves chat picture
   * @param chatId Chat id
   * @returns url of the chat picture or undefined if there is no picture for the chat.
   */
  public async getProfilePicFromServer(chatId: string) {
    return this.page.evaluate(
      (chatId) => WAPI.getProfilePicFromServer(chatId),
      chatId
    );
  }

  /**
   * Load more messages in chat object from server. Use this in a while loop
   * @param contactId
   * @returns contact detial as promise
   * @deprecated
   */
  public async loadEarlierMessages(contactId: string) {
    return this.page.evaluate(
      (contactId: string) => WAPI.loadEarlierMessages(contactId),
      contactId
    );
  }

  /**
   * Retrieves status of given contact
   * @param contactId
   */
  public async getStatus(contactId: string) {
    return this.page.evaluate(
      (contactId: string) => WAPI.getStatus(contactId),
      contactId
    );
  }

  /**
   * Checks if a number is a valid whatsapp number
   * @param contactId, you need to include the @c.us at the end.
   * @returns contact detial as promise
   */
  public async getNumberProfile(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.getNumberProfile(contactId),
      contactId
    );
  }

  //PRO
  /**
   * Retrieves all undread Messages
   */
  public async getUnreadMessages() {
    return await this.page.evaluate(() => WAPI.getUnreadMessages());
  }

  /**
   * Retrieves all messages already loaded in a chat
   * For loading every message use loadAndGetAllMessagesInChat
   * @param chatId, the chat to get the messages from
   * @param includeMe, include my own messages? boolean
   * @param includeNotifications
   * @returns any
   */
  public async getAllMessagesInChat(
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) {
    return await this.page.evaluate(
      ({ chatId, includeMe, includeNotifications }) =>
        WAPI.getAllMessagesInChat(chatId, includeMe, includeNotifications),
      { chatId, includeMe, includeNotifications }
    );
  }

  /**
   * Loads and Retrieves all Messages in a chat
   * @param chatId, the chat to get the messages from
   * @param includeMe, include my own messages? boolean
   * @param includeNotifications
   * @returns any
   */
  public async loadAndGetAllMessagesInChat(
    chatId: string,
    includeMe = false,
    includeNotifications = false
  ) {
    return await this.page.evaluate(
      ({ chatId, includeMe, includeNotifications }) =>
        WAPI.loadAndGetAllMessagesInChat(
          chatId,
          includeMe,
          includeNotifications
        ),
      { chatId, includeMe, includeNotifications }
    );
  }

  /**
   * Checks if a CHAT contact is online.
   * @param chatId chat id: xxxxx@c.us
   */
  public async getChatIsOnline(chatId: string): Promise<boolean> {
    return await this.page.evaluate(
      (chatId: string) => WAPI.getChatIsOnline(chatId),
      chatId
    );
  }

  /**
   * Retrieves the last seen of a CHAT.
   * @param chatId chat id: xxxxx@c.us
   */
  public async getLastSeen(chatId: string): Promise<number | boolean> {
    return await this.page.evaluate(
      (chatId: string) => WAPI.getLastSeen(chatId),
      chatId
    );
  }
}

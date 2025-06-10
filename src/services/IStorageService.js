/**
 * Интерфейс для работы с хранилищем сообщений
 */
export class IStorageService {
  /**
   * Отправить сообщение
   * @param {Object} message - объект сообщения
   * @param {string} message.text - текст сообщения
   * @param {string} message.uid - ID пользователя
   * @param {string} message.photoURL - URL аватара
   * @returns {Promise<void>}
   */
  async sendMessage(message) {
    throw new Error('Method must be implemented');
  }

  /**
   * Получить сообщения
   * @param {number} limit - лимит сообщений
   * @param {function} callback - колбэк для получения сообщений
   * @returns {function} - функция для отписки от изменений
   */
  subscribeToMessages(limit, callback) {
    throw new Error('Method must be implemented');
  }

  /**
   * Получить название типа хранилища
   * @returns {string}
   */
  getStorageType() {
    throw new Error('Method must be implemented');
  }
}

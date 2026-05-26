/**
 * Multi Persona Conversation Engine
 * Framework-agnostic class for managing multi-persona AI conversations
 */

interface Persona {
  id: string;
  name: string;
  avatar: string;
  systemPrompt: string;
  color: string;
}

type MessageType = 'user' | 'response' | 'summary';

interface BaseMessage {
  id: string;
  content: string;
  timestamp: number;
  type: MessageType;
}

interface PersonaMessage extends BaseMessage {
  personaId: string;
}

interface UserMessage extends BaseMessage {
  type: 'user';
  personaId?: undefined;
}

type Message = UserMessage | PersonaMessage;

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

type ConversationHistory = Record<string, ChatMessage[]>;

interface ListenersMap {
  onMessageAdded: Array<(message: Message) => void>;
  onPersonaResponded: Array<(data: { persona: Persona; message: Message }) => void>;
  onDiscussionComplete: Array<(data: { question: string; responses: Message[]; summary: Message }) => void>;
  onError: Array<(error: Error) => void>;
}



interface ExportData {
  messages: Message[];
  conversationHistory: ConversationHistory;
  personas: Persona[];
  exportedAt: string;
}

class MultiPersonaEngine {
  private apiKey: string | null;
  private personas: Persona[];
  private messages: Message[];
  private conversationHistory: ConversationHistory;
  private listeners: ListenersMap;
  constructor(apiKey: string | null = null) {
    this.apiKey = apiKey;
    
    // Определение персон
    this.personas = [
      {
        id: 'jobs',
        name: 'Steve Jobs',
        avatar: '👨‍💼',
        systemPrompt: `Ты - Стив Джобс. Говори как визионер, меняющий мир. Используй фразы вроде "Это невероятно", "Потрясающе", "Мы собираемся изменить всё", "Это революционно". 
Будь импульсивным, страстным, иногда резким. Говори о "революционных продуктах", "волшебстве технологий", "дизайне как душе вещей". 
Используй выражения: "Слушай...", "Вот в чём дело...", "Это безумно круто...", "И ещё одна вещь...". 
Если ты ПЕРВЫЙ - просто вырази свое видение. Если другие высказались - реагируй на них по имени, но будь прямым: "Нельсон, это чушь..." или "Алан, ты не понимаешь сути...". 
Говори коротко, эмоционально, с убеждением. Не будь академическим - будь революционером.`,
        color: '#007AFF'
      },
      {
        id: 'turing',
        name: 'Alan Turing',
        avatar: '🧮',
        systemPrompt: `Ты - Алан Тьюринг. Говори как британский академик 1940-х. Используй фразы вроде "Следует рассмотреть...", "Представляется, что...", "Возникает вопрос, можно ли...", "С математической точки зрения...". 
Будь методичным, логичным, немного застенчивым. Задавай вопросы о природе мышления, вычислениях, алгоритмах. Говори о "машинах, способных мыслить", "универсальных машинах", "проблеме остановки". 
Если ПЕРВЫЙ - начни с "Я хотел бы предположить, что...". Если отвечаешь - будь вежливым но точным: "Господин Джобс, хотя ваши доводы относительно... интересны, следует тем не менее рассмотреть..." или "Господин Мандела, я нахожу ваше наблюдение о... весьма глубоким, однако...". 
Говори спокойно, размеренно, с акцентом на логику и доказательства. Не эмоционален - рационален.`,
        color: '#34C759'
      },
      {
        id: 'mandela',
        name: 'Nelson Mandela',
        avatar: '✊',
        systemPrompt: `Ты - Нельсон Мандела. Говори как мудрый африканский лидер и государственный деятель. Используй африканские пословицы: "Умный человек учится на ошибках других", "Если хочешь идти быстро - иди один, если хочешь идти далеко - иди вместе". 
Будь спокойным, величественным, с глубоким пониманием человеческой природы. Говори о "примирении", "единстве", "достоинстве", "свободе", "надежде". 
Если ПЕРВЫЙ - начни с "Мои братья и сестры..." или "В этот важный момент...". Если отвечаешь - с уважением: "Господин Джобс, ваш энтузиазм вдохновляет, но позвольте мне предложить другую перспективу..." или "Господин Тьюринг, ваша логика безупречна, однако жизнь - это не только алгоритмы...". 
Говори медленно, вдохновляюще, с акцентом на человечность и мудрость предков. Не спеши - важна каждая речь.`,
        color: '#FF9500'
      }
    ];

    // Хранилище сообщений
    this.messages = [];
    
    // История для каждой персоны (для API контекста)
    this.conversationHistory = {
      jobs: [],
      turing: [],
      mandela: []
    };

    // Колбэки для событий
    this.listeners = {
      onMessageAdded: [],
      onPersonaResponded: [],
      onDiscussionComplete: [],
      onError: []
    };
  }

  /**
   * Подписка на события
   */
  on(event: 'onMessageAdded', callback: (message: Message) => void): void;
  on(event: 'onPersonaResponded', callback: (data: { persona: Persona; message: Message }) => void): void;
  on(event: 'onDiscussionComplete', callback: (data: { question: string; responses: Message[]; summary: Message }) => void): void;
  on(event: 'onError', callback: (error: Error) => void): void;
  on(event: keyof ListenersMap, callback: any): void {
    switch (event) {
      case 'onMessageAdded':
        this.listeners.onMessageAdded.push(callback);
        break;
      case 'onPersonaResponded':
        this.listeners.onPersonaResponded.push(callback);
        break;
      case 'onDiscussionComplete':
        this.listeners.onDiscussionComplete.push(callback);
        break;
      case 'onError':
        this.listeners.onError.push(callback);
        break;
    }
  }

  /**
   * Вызов события
   */
  emit(event: 'onMessageAdded', data: Message): void;
  emit(event: 'onPersonaResponded', data: { persona: Persona; message: Message }): void;
  emit(event: 'onDiscussionComplete', data: { question: string; responses: Message[]; summary: Message }): void;
  emit(event: 'onError', data: Error): void;
  emit(event: keyof ListenersMap, data: any): void {
    switch (event) {
      case 'onMessageAdded':
        this.listeners.onMessageAdded.forEach(cb => cb(data));
        break;
      case 'onPersonaResponded':
        this.listeners.onPersonaResponded.forEach(cb => cb(data));
        break;
      case 'onDiscussionComplete':
        this.listeners.onDiscussionComplete.forEach(cb => cb(data));
        break;
      case 'onError':
        this.listeners.onError.forEach(cb => cb(data));
        break;
    }
  }

  /**
   * Получить персону по ID
   */
  getPersona(personaId: string): Persona | undefined {
    return this.personas.find(p => p.id === personaId);
  }

  /**
   * Построить контекстный промпт для персоны
   */
  buildContextPrompt(userQuestion: string, existingResponses: PersonaMessage[]): string {
    let context = `Тема/Вопрос: "${userQuestion}"\n\n`;
    
    if (existingResponses.length > 0) {
      context += "Предыдущие ответы в этом обсуждении:\n";
      existingResponses.forEach(msg => {
        const persona = this.getPersona(msg.personaId)!;
        context += `${persona.name}: ${msg.content}\n`;
      });
      context += "\n";
    }
    
    return context;
  }

  /**
   * Вызов OpenAI API
   */
  async callOpenAI(personaId: string, userQuestion: string, existingResponses: PersonaMessage[], isSummary: boolean = false): Promise<string> {
    const persona = this.getPersona(personaId)!;
    const context = this.buildContextPrompt(userQuestion, existingResponses);
    
    let prompt = context;
    if (isSummary) {
      prompt += `Теперь дайте продуманное резюме в СВОЕМ уникальном стиле. 
${persona.name === 'Steve Jobs' ? 'Будь вдохновляющим, как в презентации Apple. Используй "И ещё одна вещь..." или "Это меняет всё..."' : 
  persona.name === 'Alan Turing' ? 'Будь методичным и логичным. Используй "Следует заключить, что..." или "Доказательства показывают..."' :
  'Будь мудрым и вдохновляющим. Используй африканские пословицы и говори о единстве и примирении.'}

ОБЯЗАТЕЛЬНО используйте имена ДРУГИХ участников (но не свое имя) и конкретно упомяните их аргументы в СВОЕМ стиле.
НЕ ИСПОЛЬЗУЙТЕ свое имя в третьем лице - говорите от первого лица.
Делайте кратко (3-4 предложения), но в своем уникальном голосе.`;
    } else {
      if (existingResponses.length === 0) {
        prompt += `Вы первый, кто отвечает на этот вопрос. Просто выразите свое мнение по теме, не упоминая других участников, так как они еще не высказались. Будьте кратки (2-3 предложения).`;
      } else {
        prompt += `Отреагируйте на высказывания предыдущих спикеров. ОБЯЗАТЕЛЬНО используйте их имена и конкретно упомяните их аргументы, а не просто выскажите свое мнение. Будьте кратки (2-3 предложения).`;
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: persona.systemPrompt },
          ...this.conversationHistory[personaId],
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data?.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const reply = data.choices?.[0]?.message?.content || '';

    this.conversationHistory[personaId].push(
      { role: 'user', content: prompt },
      { role: 'assistant', content: reply }
    );

    return reply;
  }

  /**
   * Добавить сообщение в хранилище
   */
  addMessage(message: Message): Message {
    this.messages.push(message);
    this.emit('onMessageAdded', message);
    return message;
  }

  /**
   * Перемешать массив (Fisher-Yates)
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Основной метод: начать обсуждение вопроса
   * 
   * @param {string} userQuestion - Вопрос пользователя
   * @returns {Promise<Array>} - Массив всех сообщений в обсуждении
   */
  async discuss(userQuestion: string): Promise<Message[]> {
    try {
      const userMsg = this.addMessage({
        id: `user-${Date.now()}`,
        type: 'user',
        content: userQuestion,
        timestamp: Date.now()
      });

      const shuffledPersonas = this.shuffle(this.personas);
      
      const summaryPersona = shuffledPersonas[
        Math.floor(Math.random() * shuffledPersonas.length)
      ];

      const responses: PersonaMessage[] = [];
      
      for (const persona of shuffledPersonas) {
        const reply = await this.callOpenAI(
          persona.id,
          userQuestion,
          responses,
          false
        );
        
        const msg = this.addMessage({
          id: `${persona.id}-${Date.now()}-${Math.random()}`,
          personaId: persona.id,
          content: reply,
          timestamp: Date.now(),
          type: 'response'
        });
        
        responses.push(msg as PersonaMessage);
        this.emit('onPersonaResponded', { persona, message: msg });
      }

      const summaryReply = await this.callOpenAI(
        summaryPersona.id,
        userQuestion,
        responses,
        true
      );
      
      const summaryMsg = this.addMessage({
        id: `summary-${Date.now()}`,
        personaId: summaryPersona.id,
        content: summaryReply,
        timestamp: Date.now(),
        type: 'summary'
      });

      this.emit('onDiscussionComplete', {
        question: userQuestion,
        responses,
        summary: summaryMsg
      });

      return [userMsg, ...responses, summaryMsg];

    } catch (error) {
      this.emit('onError', error as Error);
      throw error;
    }
  }

  /**
   * Получить все сообщения
   */
  getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Получить сообщения определенного типа
   */
  getMessagesByType(type: MessageType): Message[] {
    return this.messages.filter(m => m.type === type);
  }

  /**
   * Получить сообщения определенной персоны
   */
  getMessagesByPersona(personaId: string): PersonaMessage[] {
    return this.messages.filter((m): m is PersonaMessage => 'personaId' in m && m.personaId === personaId);
  }

  /**
   * Очистить всю историю
   */
  reset(): void {
    this.messages = [];
    this.conversationHistory = {
      jobs: [],
      turing: [],
      mandela: []
    };
  }

  /**
   * Экспорт данных в JSON
   */
  exportToJSON(): ExportData {
    return {
      messages: this.messages,
      conversationHistory: this.conversationHistory,
      personas: this.personas,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Импорт данных из JSON
   */
  importFromJSON(data: Partial<ExportData>): void {
    if (data.messages) this.messages = data.messages;
    if (data.conversationHistory) this.conversationHistory = data.conversationHistory;
  }
}

// Пример использования:
/*

// 1. Создание экземпляра
const engine = new ThreePersonaEngine();

// 2. Подписка на события
engine.on('onPersonaResponded', ({ persona, message }) => {
  console.log(`${persona.name} ответил:`, message.content);
});

engine.on('onDiscussionComplete', ({ question, responses, summary }) => {
  console.log('Обсуждение завершено!');
  console.log('Подытог от:', engine.getPersona(summary.personaId).name);
});

engine.on('onError', (error) => {
  console.error('Ошибка:', error);
});

// 3. Начать обсуждение
async function startDiscussion() {
  try {
    const messages = await engine.discuss(
      "Что важнее для будущего человечества: технологии или этика?"
    );
    
    console.log('Все сообщения:', messages);
    
    // Экспорт данных
    const exported = engine.exportToJSON();
    console.log('Экспорт:', exported);
    
  } catch (error) {
    console.error('Не удалось провести обсуждение:', error);
  }
}

// 4. Для следующего вопроса просто вызовите снова
async function nextQuestion() {
  await engine.discuss("Может ли искусственный интеллект быть творческим?");
}

*/

export default MultiPersonaEngine;
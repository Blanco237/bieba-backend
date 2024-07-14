declare global {
  interface ObjectConstructor {
    /**
     * Groups members of an iterable according to the return value of the passed callback.
     * @param items An iterable.
     * @param keySelector A callback which will be invoked for each item in items.
     */
    groupBy<K extends PropertyKey, T>(
      items: Iterable<T>,
      keySelector: (item: T, index: number) => K
    ): Partial<Record<K, T[]>>
  }
}

export interface Organization {
  id: string;
  logo: string;
  name: string;
  email: string;
  hotp_secret: string;
  hotp_counter: string;
  api_key: string;
  callback_url: string; 
}
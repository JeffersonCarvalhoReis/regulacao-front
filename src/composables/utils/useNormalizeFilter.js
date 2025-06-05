export function useNormalizeFilter() {
    function customAccentInsensitiveFilter(item, queryText, itemText) {
      const normalize = (str) =>
        str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();

      const normalizedItem = normalize(itemText);
      const normalizedQuery = normalize(queryText);

      return normalizedItem.includes(normalizedQuery);
    }
    return {
      customAccentInsensitiveFilter
    }
}

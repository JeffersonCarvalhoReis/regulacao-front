export function useOnlyNumbers () {
  const onlyNumbers = event => {
    const key = event.key;
    if (!/^\d+$/.test(key)) {
      event.preventDefault();
    }
  };
  const handlePaste = (event, transformFn = val => val, setValue, options = {}) => {
    let pasted = event.clipboardData.getData('text');
    pasted = pasted.replace(/\s/g, '');

    if (options.maxDigits && pasted.length > options.maxDigits) {
      pasted = pasted.slice(0, options.maxDigits);
    }

    const finalValue = transformFn(pasted);
    setValue(finalValue);
    event.preventDefault();
  };

  return { onlyNumbers, handlePaste };
}

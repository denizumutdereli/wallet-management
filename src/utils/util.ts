import { logger } from './logger';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const isJson = (input: any) => {
  try {
    if (input) {
      const o = JSON.parse(input);

      //validate the result too
      if (o && o.constructor === Object) {
        return o;
      }
    }
  } catch (error: any) {
    logger.error(error.response.data.error, { stack: error.stack });
  }

  return false;
};

export const sleep = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
};

export const getArgs = () => {
  const args = {};
  process.argv.slice(2, process.argv.length).forEach(arg => {
    // long arg
    if (arg.slice(0, 2) === '--') {
      const longArg = arg.split('=');
      const longArgFlag = longArg[0].slice(2, longArg[0].length);
      const longArgValue = longArg.length > 1 ? longArg[1] : true;
      args[longArgFlag] = longArgValue;
    }
    // flags
    else if (arg[0] === '-') {
      const flags = arg.slice(1, arg.length).split('');
      flags.forEach(flag => {
        args[flag] = true;
      });
    }
  });
  return args;
};

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getMemory = () => {
  Object.entries(process.memoryUsage()).forEach(item => console.log(`${item[0]}: ${(item[1] / 1024 / 1024).toFixed(4)} MB`));
};

export const convertToHumanReadableSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 ** 3) {
    return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  } else {
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  }
};

import { QueryOptions } from 'mongoose';
import CommonConstants from 'src/common/constants/common.constants';

export const getPagingData = (
  page: string,
  limit: string,
): Pick<QueryOptions, 'limit' | 'skip'> => {
  const pageInt = parseInt(page) || CommonConstants.DEFAULT_PAGE;
  const limitInt = parseInt(limit) || CommonConstants.DEFAULT_PAGE_LIMIT;
  return {
    skip: pageInt * limitInt,
    limit: limitInt,
  };
};

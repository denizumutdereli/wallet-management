import i18n from '@/i18n';
import { Request } from 'express';

export interface PaginationFields {
  page: number;
  limit: number;
}

const getDefaultPaginationSettings = () => ({
  page: 1,
  limit: 10,
  customLabels: {
    docs: 'results',
    totalDocs: i18n.t('PAGINATION').TOTALDOCS,
    totalPages: i18n.t('PAGINATION').TOTALPAGES,
    pagingCounter: i18n.t('PAGINATION').PAGINGCOUNTER,
    hasPrevPage: i18n.t('PAGINATION').HASPREVPAGE,
    hasNextPage: i18n.t('PAGINATION').HASNEXTPAGE,
    prevPage: i18n.t('PAGINATION').PREVPAGE,
    nextPage: i18n.t('PAGINATION').NEXTPAGE,
  },
});

export const paginationMiddleware = (req: Request) => {
  const pagination = getDefaultPaginationSettings();

  const { body, params, query } = req;
  if (body.page || params.page || query.page) {
    pagination.page = parseInt(body.page || params.page || query.page);
  }

  if (body.limit || params.limit || query.limit) {
    pagination.limit = parseInt(body.limit || params.limit || query.limit);
  }

  req.pagination = pagination;
};

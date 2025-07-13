//src/lib/searchparams.ts
import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  category: parseAsString,
  sample_type: parseAsString,
  color: parseAsString,
  weight_min: parseAsInteger,
  weight_max: parseAsInteger,
  width_min: parseAsInteger,
  width_max: parseAsInteger
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);

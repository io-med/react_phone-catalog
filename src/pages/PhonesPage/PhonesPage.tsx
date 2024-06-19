import { useEffect, useRef, useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Filter } from '../../components/Filter';
import { Pagination } from '../../components/Pagination';
import { ProductsList } from '../../components/ProductsList';
import './PhonesPage.scss';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../../types/SearchParams';
import { getProducts } from '../../api/products';
import { Product } from '../../types/Product';
import { ProductCategories } from '../../types/ProductCategories';
import { SortBy } from '../../types/SortBy';
import { PerPage } from '../../types/PerPage';

const DEF_SORT = SortBy.NEWEST;
const DEF_DISPLAYED = PerPage.EIGHT;

export const PhonesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagesNumber, setPagesNumber] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [searchParams] = useSearchParams();
  const perPage = +(searchParams.get(SearchParams.PER_PAGE) ?? DEF_DISPLAYED);
  const listRef = useRef<HTMLDivElement>(null);

  const loadProducts = async () => {
    try {
      const productsFromServer = await getProducts();
      const phones = productsFromServer.filter(
        product => product.category === ProductCategories.PHONES,
      );

      setProducts(phones);
    } catch (error) {
      setHasError(true);
      throw error;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (perPage === 0) {
      setPagesNumber(1);

      return;
    }

    setPagesNumber(Math.floor(products.length / perPage) || 1);
  }, [perPage, products.length]);

  const scrollToTop = () => {
    if (listRef.current) {
      const list = listRef.current as HTMLDivElement;

      list.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="phones-page container">
      <div className="phones-page__breadcrumbs">
        <Breadcrumbs />
      </div>

      <h1 className="phones-page__title">Mobile phones</h1>
      <p className="phones-page__models-count">
        {products.length > 0 ? `${products.length} models` : 'Loading...'}
      </p>

      <div className="phones-page__filter">
        <Filter DEF_DISPLAYED={DEF_DISPLAYED} DEF_SORT={DEF_SORT} />
      </div>

      <div className="phones-page__product-list" ref={listRef}>
        <ProductsList products={products} hasError={hasError} />
      </div>

      {pagesNumber > 1 && perPage > 0 && (
        <Pagination pagesNumber={pagesNumber} scrollToTop={scrollToTop} />
      )}
    </main>
  );
};
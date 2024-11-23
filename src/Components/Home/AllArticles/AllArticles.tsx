import React, { useEffect, useState } from "react";
import "./AllArticles.css";
import PaginationComponent from "../../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL_CONSTANT } from "../../../Utilities/constants";
import { fetchArticlesApiCall } from "../../../Services/GetAllArticles";
import store from "../../../Store/store";
import { useDispatch, useSelector } from "react-redux";

const dispatchStore = store.dispatch as typeof store.dispatch | React.Dispatch<any>;

const AllArticles: React.FC = () => {
  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [authors, setAuthors] = useState<string[]>([]); 

  const itemsPerPage = 5; // Set to 10 for pagination

  const { data: articles, loader, error, pagination } = useSelector(
    (state: any) => state.auth.articles
  );

  const navigate = useNavigate();

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatchStore(fetchArticlesApiCall(page, itemsPerPage)); // Fetch articles for the selected page
  };

  // Effect to fetch articles when the component mounts or when currentPage changes
  useEffect(() => {
    dispatchStore(fetchArticlesApiCall(currentPage, itemsPerPage)); // Fetch data for the current page
  }, [dispatchStore, currentPage]);

  // Update pagination state when pagination changes in Redux
  useEffect(() => {
    console.log("s",pagination)
    if (pagination) {
      setCurrentPage(pagination.current_page);
      setTotalPages(pagination.total_pages);
      setTotalItems(pagination.total_items);
    }
  }, [pagination]); // This will run when pagination data changes

  // Handle navigation to individual article view
  const handleNavigate = (id: any) => {
    navigate(ROUTER_URL_CONSTANT.VIEW_ARTICLE + id);
  };

  // Extract unique authors whenever articles are updated
  useEffect(() => {
    if (articles?.length > 0) {
      const uniqueAuthors:any = Array.from(new Set(articles.map((article: any) => article.posted_by)));
      setAuthors(uniqueAuthors); // Update authors state with unique values
    }
  }, [articles]);

  return (
    <div className="all-articles-layout">
      <ul>
        {authors.map((author) =>(
          <li>{author}</li>
        ))}
      </ul>
      <div className="heading-title text-center">
        <h2 className="title iq-tw-6">Welcome to Your Blogging Haven</h2>
        <p>
          Share your thoughts, discover inspiring articles, and connect with
          like-minded writers in a space designed for creativity and expression.
        </p>
      </div>
      {articles.length === 0 ? (
        <p>Loading articles...</p>
      ) : (
        <ul className="articles-section">
          {articles.map((article:any) => (
            <li key={article.id} className="article-card">
              <div className="d-flex flex-row align-items-center gap-2 justify-content-between">
                <span className="article-title">{article.title}</span>

                <button
                  className="small-but"
                  onClick={() => handleNavigate(article.id)}
                >
                  View Article
                </button>
              </div>
              <div className="d-flex flex-row align-items-center gap-2">
                <span className="article-sub-title">
                  <strong>Author:</strong> {article.posted_by}
                </span>
                <span className="article-sub-title">
                  <strong>Date:</strong>{" "}
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
              </div>
              <span className="article-sub-title">{article.excerpt}</span>
            </li>
          ))}
          {articles?.length > 0 && (
            <div className="mt-5">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default AllArticles;

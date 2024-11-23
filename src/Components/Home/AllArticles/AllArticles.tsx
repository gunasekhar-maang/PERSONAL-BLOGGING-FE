import React, { useEffect, useState } from "react";
import "./AllArticles.css";
import PaginationComponent from "../../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL_CONSTANT } from "../../../Utilities/constants";
import { fetchArticlesApiCall } from "../../../Services/GetAllArticles";
import store from "../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../../Store/Auth";
import Loader from "../../Loader/Loader";

const dispatchStore = store.dispatch as
  | typeof store.dispatch
  | React.Dispatch<any>;

const AllArticles: React.FC = () => {
  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [authors, setAuthors] = useState<any>([]);
  const [currentAuthorId, setCurrentAuthorId] = useState("");

  const itemsPerPage = 5; // Set to 10 for pagination

  const {
    data: articles,
    loader,
    error,
    pagination,
  } = useSelector((state: any) => state.auth.articles);

  const navigate = useNavigate();

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatchStore(fetchArticlesApiCall(page, itemsPerPage, currentAuthorId)); // Fetch articles for the selected page
  };

  // Effect to fetch articles when the component mounts or when currentPage changes
  useEffect(() => {
    dispatchStore(
      fetchArticlesApiCall(currentPage, itemsPerPage, currentAuthorId)
    ); // Fetch data for the current page
  }, [currentAuthorId, currentPage]);

  // Update pagination state when pagination changes in Redux
  useEffect(() => {
    console.log("s", pagination);
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

  useEffect(() => {
    if (articles?.length > 0) {
      const uniqueAuthors = Array.from(
        new Set(
          articles.map((article: any) =>
            JSON.stringify({
              author_name: article.posted_by,
              author_id: article.author_id,
            })
          )
        )
      ).map((author: any) => JSON.parse(author));

      setAuthors(uniqueAuthors); // Update authors state with unique values
    }
  }, [articles]);

  //Login User Details
  const Fetch_Login_User = useSelector(authSelectors.getLoginUserState);
  const Login_User = Fetch_Login_User?.data?.data?.user_details;
  const loadingUserState = Fetch_Login_User?.loader;
  const errorUserState = Fetch_Login_User?.error;

  console.log(Login_User);

  return (
    <div className="all-articles-layout">
      {/* <ul>
        {authors?.map((author: any) => (
          <li onClick={() => setCurrentAuthorId(author?.author_id)}>
            {author?.author_id}.{author?.author_name}
          </li>
        ))}
      </ul> */}
      <div className="heading-title text-center">
        <h2 className="title iq-tw-6">Welcome to Your Blogging Haven</h2>
        <p>
          Share your thoughts, discover inspiring articles, and connect with
          like-minded writers in a space designed for creativity and expression.
        </p>
      </div>
      {articles?.length === 0 ? (
        <Loader />
      ) : (
        <div className="article-section-layout">
          <div className="side-bar">
            <h6>Choose By Author</h6>
            {authors?.map((author: any) => (
              <div key={author.author_id} className="d-flex align-items-center gap-1">
                <input
                  type="checkbox"
                  id={`author-${author.author_id}`}
                  value={author.author_id}
                  onChange={(e) =>
                    setCurrentAuthorId(author.author_id)
                  }
                />
                <label htmlFor={`author-${author.author_id}`}>
                   {author.author_name}
                </label>
              </div>
            ))}
          </div>

          <ul className="articles-section w-100">
            {articles?.map((article: any) => (
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
        </div>
      )}
    </div>
  );
};

export default AllArticles;

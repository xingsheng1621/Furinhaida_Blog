'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './search.module.css';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.trim() === '') {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?keyword=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.posts || []);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setKeyword('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="搜索博客..."
          value={keyword}
          onChange={handleSearch}
          className={styles.input}
        />
        {keyword && (
          <button onClick={handleClear} className={styles.clearBtn}>
            ✕
          </button>
        )}
      </div>

      {showResults && (
        <div className={styles.resultsContainer}>
          {loading ? (
            <div className={styles.loading}>搜索中...</div>
          ) : results.length === 0 ? (
            <div className={styles.noResults}>未找到相关文章</div>
          ) : (
            <div className={styles.results}>
              {results.map((post) => (
                <Link
                  key={post._id}
                  href={`/posts/${post.slug}`}
                  className={styles.resultItem}
                  onClick={() => handleClear()}
                >
                  <h3 className={styles.resultTitle}>{post.title}</h3>
                  <p className={styles.resultDesc}>{post.desc}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;

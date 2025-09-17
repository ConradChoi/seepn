"use client";
import React, { useState, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
interface SearchSidebarProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  currentLanguage?: "ko" | "en" | "ja" | "zh";
  getText: (key: string) => string;
  getL1Categories: (lang: string) => { value: string; label: string }[];
  getL2Categories: (
    l1: string,
    lang: string
  ) => { value: string; label: string }[];
  getL3Categories: (
    l1: string,
    l2: string,
    lang: string
  ) => { value: string; label: string }[];
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({
  currentLanguage = 'ko',
  searchKeyword,
  setSearchKeyword,
  getL1Categories,
  getL2Categories,
  getL3Categories,
}) => {
  const [selectedL1Category, setSelectedL1Category] = useState("");
  const [selectedL2Category, setSelectedL2Category] = useState("");
  const [selectedL3Category, setSelectedL3Category] = useState("");
  // L1 카테고리
  const l1Categories = useMemo(() => {
    try {
      return getL1Categories(currentLanguage);
    } catch (error) {
      console.error("Error loading L1 categories:", error);
      return [];
    }
  }, [currentLanguage, getL1Categories]);

  // L2 카테고리
  const l2Categories = useMemo(() => {
    try {
      return selectedL1Category && selectedL1Category !== ""
        ? getL2Categories(selectedL1Category, currentLanguage)
        : [];
    } catch (error) {
      console.error("Error loading L2 categories:", error);
      return [];
    }
  }, [selectedL1Category, currentLanguage, getL2Categories]);

  // L3 카테고리
  const l3Categories = useMemo(() => {
    try {
      return selectedL2Category &&
        selectedL2Category !== "" &&
        selectedL2Category !== "all"
        ? getL3Categories(
            selectedL1Category,
            selectedL2Category,
            currentLanguage
          )
        : [];
    } catch (error) {
      console.error("Error loading L3 categories:", error);
      return [];
    }
  }, [selectedL1Category, selectedL2Category, currentLanguage, getL3Categories]);
  const handleL1CategoryChange = (value: string) => {
    try {
      setSelectedL1Category(value || "");
      setSelectedL2Category("all"); // 하위 단계를 "전체"로 설정
      setSelectedL3Category("all");
    } catch (error) {
      console.error("Error in handleL1CategoryChange:", error);
    }
  };

  const handleL2CategoryChange = (value: string) => {
    try {
      setSelectedL2Category(value || "all");
      setSelectedL3Category("all"); // 하위 단계를 "전체"로 설정
    } catch (error) {
      console.error("Error in handleL2CategoryChange:", error);
    }
  };

  const handleL3CategoryChange = (value: string) => {
    try {
      setSelectedL3Category(value || "all");
    } catch (error) {
      console.error("Error in handleL3CategoryChange:", error);
    }
  };
  const [isOpen, setIsOpen] = useState(false); // 초기 상태는 '닫힘' (false)
  // 지역 선택 핸들러

  const getText = (key: string) => {
    const texts = {
      ko: {
        pageTitle: "공급사 검색",
        searchTitle: "검색 조건",
        resultsTitle: "검색 결과",
        noResults: "검색 결과가 없습니다.",
        noMatchedSuppliers: "검색된 공급사가 없습니다.",
        searchPlaceholder: "공급사명, 제품명 등을 입력하세요",
        searchButton: "검색",
        resetButton: "초기화",
        category: "품목",
        region: "지역",
        companySize: "기업 규모",
        searchKeyword: "검색어",
        allCategories: "전체",
        allRegions: "전체",
        allSizes: "전체 규모",
        selectCategory: "품목 선택",
        selectRegion: "지역 선택",
        selectSubCategory: "세부 품목 선택",
        selectDetailCategory: "상세 품목 선택",
        selectSubRegion: "상세 지역 선택",
        // 기업 규모
        largeCorp: "대기업",
        mediumCorp: "중견기업",
        smallCorp: "중소기업",
        startup: "스타트업",
        // 보기 모드
        galleryView: "갤러리 보기",
        listView: "리스트 보기",
        totalResults: "총 {count}개의 공급사",
        employees: "직원 수",
        rating: "평점",
        viewDetail: "상세보기",
        // 모바일 검색
        searchFilter: "검색",
        applyFilter: "필터 적용",
        closeFilter: "닫기",
      },
      en: {
        pageTitle: "Supplier Search",
        searchTitle: "Search Criteria",
        resultsTitle: "Search Results",
        noResults: "No search results found.",
        noMatchedSuppliers: "No suppliers found.",
        searchPlaceholder: "Enter supplier name, product name, etc.",
        searchButton: "Search",
        resetButton: "Reset",
        category: "Product/Service",
        region: "Region",
        companySize: "Company Size",
        searchKeyword: "Search Keyword",
        allCategories: "All",
        allRegions: "All",
        allSizes: "All Sizes",
        selectCategory: "Select Category",
        selectRegion: "Select Region",
        selectSubCategory: "Select Sub Category",
        selectDetailCategory: "Select Detail Category",
        selectSubRegion: "Select Sub Region",
        // 기업 규모
        largeCorp: "Large Corporation",
        mediumCorp: "Medium Enterprise",
        smallCorp: "Small & Medium Enterprise",
        startup: "Startup",
        // 보기 모드
        galleryView: "Gallery View",
        listView: "List View",
        totalResults: "Total {count} suppliers",
        employees: "Employees",
        rating: "Rating",
        viewDetail: "View Details",
        // 모바일 검색
        searchFilter: "Search Filter",
        applyFilter: "Apply Filter",
        closeFilter: "Close",
      },
      ja: {
        pageTitle: "サプライヤー検索",
        searchTitle: "検索条件",
        resultsTitle: "検索結果",
        noResults: "検索結果がありません。",
        noMatchedSuppliers: "該当するサプライヤーがありません。",
        searchPlaceholder: "サプライヤー名、製品名などを入力",
        searchButton: "検索",
        resetButton: "リセット",
        category: "製品/サービス",
        region: "地域",
        companySize: "企業規模",
        searchKeyword: "検索キーワード",
        allCategories: "全体",
        allRegions: "全体",
        allSizes: "全規模",
        selectCategory: "カテゴリ選択",
        selectRegion: "地域選択",
        selectSubCategory: "サブカテゴリ選択",
        selectDetailCategory: "詳細カテゴリ選択",
        selectSubRegion: "詳細地域選択",
        // 기업 규모
        largeCorp: "大企業",
        mediumCorp: "中堅企業",
        smallCorp: "中小企業",
        startup: "スタートアップ",
        // 보기 모드
        galleryView: "ギャラリー表示",
        listView: "リスト表示",
        totalResults: "合計{count}社のサプライヤー",
        employees: "従業員数",
        rating: "評価",
        viewDetail: "詳細を見る",
        // 모바일 검색
        searchFilter: "検索フィルター",
        applyFilter: "フィルター適用",
        closeFilter: "閉じる",
      },
      zh: {
        pageTitle: "供应商搜索",
        searchTitle: "搜索条件",
        resultsTitle: "搜索结果",
        noResults: "没有找到搜索结果。",
        noMatchedSuppliers: "未找到匹配的供应商。",
        searchPlaceholder: "输入供应商名称、产品名称等",
        searchButton: "搜索",
        resetButton: "重置",
        category: "产品/服务",
        region: "地区",
        companySize: "企业规模",
        searchKeyword: "搜索关键词",
        allCategories: "全部",
        allRegions: "全部",
        allSizes: "全部规模",
        selectCategory: "选择类别",
        selectRegion: "选择地区",
        selectSubCategory: "选择子类别",
        selectDetailCategory: "选择详细类别",
        selectSubRegion: "选择详细地区",
        // 기업 규모
        largeCorp: "大企业",
        mediumCorp: "中型企业",
        smallCorp: "中小企业",
        startup: "初创企业",
        // 보기 모드
        galleryView: "画廊视图",
        listView: "列表视图",
        totalResults: "共{count}家供应商",
        employees: "员工数",
        rating: "评分",
        viewDetail: "查看详情",
        // 모바일 검색
        searchFilter: "搜索筛选",
        applyFilter: "应用筛选",
        closeFilter: "关闭",
      },
    };

    return (
      texts[currentLanguage as keyof typeof texts]?.[
        key as keyof typeof texts.ko
      ] || texts.ko[key as keyof typeof texts.ko]
    );
  };

  return (
    <aside>
      {/* <h2 className="text-lg font-semibold">{getText("pageTitle")}</h2>
      <div className="mt-4">
        <h3>{getText("searchTitle")}</h3>
        <p>{getText("resultsTitle")}</p>
      </div> */}
      <div className="flex gap-8">
        <div className="w-full md:block">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getText("searchKeyword")}
            </label>
            <div className="flex">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={getText("searchPlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button onClick={() => setIsOpen(!isOpen)} className="">
                {isOpen ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* Search Form */}
            <div className={`mt-4 ${isOpen ? "block" : "hidden"}`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {getText("searchTitle")}
              </h2>
              {/* Search Input */}
              <div></div>
              {/* L1 */}
              <div className="w-full flex justify-between gap-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getText("category")}
                  </label>
                  <select
                    value={selectedL1Category}
                    onChange={(e) => {
                      setSelectedL1Category(e.target.value);
                      setSelectedL2Category("");
                      setSelectedL3Category("");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  >
                    <option value="">{getText("allCategories")}</option>
                    {l1Categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* L2 */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getText("region")}
                  </label>

                  {/* L1 Category */}
                  <select
                    value={selectedL1Category}
                    onChange={(e) => handleL1CategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  >
                    <option value="">{getText("allCategories")}</option>
                    {l1Categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* L3 Category */}
                <div className="w-full">
                  {selectedL2Category && selectedL2Category !== "all" && (
                    <select
                      value={selectedL3Category}
                      onChange={(e) => handleL3CategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">{getText("allCategories")}</option>
                      {l3Categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText("companySize")}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">{getText("allSizes")}</option>
                      <option value="large">{getText("largeCorp")}</option>
                      <option value="medium">{getText("mediumCorp")}</option>
                      <option value="small">{getText("smallCorp")}</option>
                      <option value="startup">{getText("startup")}</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* 현재 선택 결과 */}
              {/* <div className="mt-4 text-sm text-gray-600">
                선택: {selectedL1Category} &gt; {selectedL2Category} &gt;{" "}
                {selectedL3Category}
              </div> */}
              <div className="flex margincenter gap-2 pt-4 w-full md:w-[30%] ">
                <button
                  onClick={() => {
                    setSearchKeyword("");
                    setSelectedL1Category("");
                    setSelectedL2Category("all");
                    setSelectedL3Category("all");
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {getText("resetButton")}
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  {getText("searchButton")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SearchSidebar;

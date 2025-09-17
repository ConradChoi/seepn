"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { samplesuppliers } from "../data/samplesuppliers";
import { SampleSupplierList } from "../../components/SampleSupplierList";
import { SearchSidebar } from "../../components/SearchSidebar";
import {
  getL1Categories,
  getL2Categories,
  getL3Categories,
} from "../../utils/categories";
import { getL1Areas, getL2Areas } from "../../utils/areas";
import {
  Grid3X3,
  List,
  MapPin,
  Star,
  Filter,
  X,
  Heart,
  ExternalLink,
  ThumbsUp,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

function SuppliersContent() {
  const [isBannerVisible, setIsBannerVisible] = React.useState(true);
  const [currentLanguage, setCurrentLanguage] = React.useState("ko");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userCountry, setUserCountry] = React.useState("대한민국");

  // 품목 카테고리 상태
  const [selectedL1Category, setSelectedL1Category] = React.useState("");
  const [selectedL2Category, setSelectedL2Category] = React.useState("all");
  const [selectedL3Category, setSelectedL3Category] = React.useState("all");

  // 지역 상태
  const [selectedL1Area, setSelectedL1Area] = React.useState("");
  const [selectedL2Area, setSelectedL2Area] = React.useState("all");

  // 검색결과 보기 모드 상태 (PC: gallery/list, Mobile: list only)
  const [viewMode, setViewMode] = React.useState<"gallery" | "list">("gallery");
  const [isMobile, setIsMobile] = React.useState(false);

  // 모바일 검색 모달 상태
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);
  const [modalStep, setModalStep] = React.useState<
    "root" | "catL1" | "catL2" | "catL3" | "areaL1" | "areaL2" | "size"
  >("root");
  const [companySize, setCompanySize] = React.useState("");

  // 검색어 상태
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialC = searchParams.get("c") || "";
  const initialA = searchParams.get("a") || "";
  const [searchKeyword, setSearchKeyword] = React.useState(initialQ);

  // 관심 공급사 상태 (공급사 ID를 Set으로 관리)
  // const [favoriteSuppliers, setFavoriteSuppliers] = React.useState<Set<number>>(new Set());

  // 관심 공급사 토글 함수
  // const toggleFavorite = (supplierId: number) => {
  //   setFavoriteSuppliers(prev => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(supplierId)) {
  //       newSet.delete(supplierId);
  //     } else {
  //       newSet.add(supplierId);
  //     }
  //     return newSet;
  //   });
  // };

  // 샘플 공급사 데이터
  const sampleSuppliers = React.useMemo(
    () => [
      {
        id: 1,
        name: "(주)테크솔루션",
        category: "정보통신",
        categoryDepth3: "시스템 개발",
        location: "서울특별시 강남구",
        description:
          "IT 솔루션 전문 기업으로 다양한 소프트웨어 개발 서비스를 제공합니다.",
        rating: 4.8,
        tags: ["소프트웨어", "IT컨설팅", "시스템개발"],
        website: "https://www.techsolution.co.kr",
        image: "/api/placeholder/300/200",
      },
      {
        id: 2,
        name: "글로벌 제조",
        category: "생산 관리",
        categoryDepth3: "정밀 부품 제조",
        location: "경기도 수원시",
        description: "정밀 부품 제조 전문 업체로 고품질 제품을 공급합니다.",
        rating: 4.6,
        tags: ["정밀부품", "제조", "품질관리"],
        website: "https://www.globalmfg.co.kr",
        image: "/api/placeholder/300/200",
      },
      {
        id: 3,
        name: "마케팅플러스",
        category: "마케팅",
        categoryDepth3: "디지털 마케팅",
        location: "서울특별시 서초구",
        description: "디지털 마케팅 전문 에이전시로 브랜드 홍보를 담당합니다.",
        rating: 4.9,
        tags: ["디지털마케팅", "브랜딩", "SNS마케팅"],
        website: "https://www.marketingplus.co.kr",
        image: "/api/placeholder/300/200",
      },
      {
        id: 4,
        name: "로지스틱코리아",
        category: "물류 관리",
        categoryDepth3: "종합 물류 서비스",
        location: "인천광역시 연수구",
        description: "종합 물류 서비스를 제공하는 전문 기업입니다.",
        rating: 4.7,
        tags: ["물류", "배송", "창고관리"],
        image: "/api/placeholder/300/200",
      },
      {
        id: 5,
        name: "에코빌딩",
        category: "건물 관리",
        categoryDepth3: "친환경 건물 관리",
        location: "부산광역시 해운대구",
        description: "친환경 건물 관리 서비스를 제공하는 전문 업체입니다.",
        rating: 4.5,
        tags: ["건물관리", "친환경", "시설관리"],
        website: "https://www.ecobuilding.co.kr",
        image: "/api/placeholder/300/200",
      },
      {
        id: 6,
        name: "스마트오피스",
        category: "사무 보조 서비스",
        categoryDepth3: "스마트 오피스 솔루션",
        location: "대구광역시 중구",
        description: "스마트 오피스 솔루션과 사무 지원 서비스를 제공합니다.",
        rating: 4.4,
        tags: ["사무지원", "스마트오피스", "업무효율"],
        website: "https://www.smartoffice.co.kr",
        image: "/api/placeholder/300/200",
      },
    ],
    []
  );

  // Expand sample data to simulate a longer list
  const allSuppliers = React.useMemo(() => {
    const expanded: typeof sampleSuppliers = [] as any;
    const repeat = 60; // 6 * 60 = 360 items total
    for (let r = 0; r < repeat; r++) {
      for (const s of sampleSuppliers) {
        expanded.push({
          ...s,
          id: r * 1000 + s.id,
          name: `${s.name} ${r + 1}`,
        });
      }
    }
    return expanded;
  }, [sampleSuppliers]);

  // Get user's country based on IP
  React.useEffect(() => {
    const getUserCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const countryNames: { [key: string]: string } = {
          KR: "대한민국",
          US: "미국",
          JP: "일본",
          CN: "중국",
          GB: "영국",
          DE: "독일",
          FR: "프랑스",
          CA: "캐나다",
          AU: "호주",
          IN: "인도",
          BR: "브라질",
          RU: "러시아",
          IT: "이탈리아",
          ES: "스페인",
          NL: "네덜란드",
          SE: "스웨덴",
          NO: "노르웨이",
          DK: "덴마크",
          FI: "핀란드",
          SG: "싱가포르",
          TH: "태국",
          VN: "베트남",
          ID: "인도네시아",
          MY: "말레이시아",
          PH: "필리핀",
        };

        const country =
          countryNames[data.country_code] || data.country_name || "대한민국";
        setUserCountry(country);
      } catch (error) {
        console.log("Failed to get user country:", error);
        // 기본값으로 대한민국 유지
      }
    };

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    getUserCountry();
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 카테고리 데이터 가져오기 (상위 depth 선택 시에만 현재 언어로 로드)
  const l1Categories = React.useMemo(() => {
    try {
      return getL1Categories(currentLanguage);
    } catch (error) {
      console.error("Error loading L1 categories:", error);
      return [];
    }
  }, [currentLanguage]);

  const l2Categories = React.useMemo(() => {
    try {
      return selectedL1Category && selectedL1Category !== ""
        ? getL2Categories(selectedL1Category, currentLanguage)
        : [];
    } catch (error) {
      console.error("Error loading L2 categories:", error);
      return [];
    }
  }, [selectedL1Category, currentLanguage]); // currentLanguage 의존성 복원

  const l3Categories = React.useMemo(() => {
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
  }, [selectedL1Category, selectedL2Category, currentLanguage]); // currentLanguage 의존성 복원

  // 지역 데이터 가져오기 (상위 depth 선택 시에만 현재 언어로 로드)
  const l1Areas = React.useMemo(() => {
    try {
      return getL1Areas(currentLanguage);
    } catch (error) {
      console.error("Error loading L1 areas:", error);
      return [];
    }
  }, [currentLanguage]);

  // Sync initial category/area from query on first render when options become available
  React.useEffect(() => {
    if (initialC && l1Categories.length > 0) {
      setSelectedL1Category(initialC);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [l1Categories.length]);

  React.useEffect(() => {
    if (initialA && l1Areas.length > 0) {
      setSelectedL1Area(initialA);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [l1Areas.length]);

  const l2Areas = React.useMemo(() => {
    try {
      return selectedL1Area && selectedL1Area !== ""
        ? getL2Areas(selectedL1Area, currentLanguage)
        : [];
    } catch (error) {
      console.error("Error loading L2 areas:", error);
      return [];
    }
  }, [selectedL1Area, currentLanguage]); // currentLanguage 의존성 복원

  // Filtered suppliers by keyword, category, area
  const filteredSuppliers = React.useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    return allSuppliers
      .filter((s) => {
        if (!kw) return true;
        return (
          s.name.toLowerCase().includes(kw) ||
          s.description.toLowerCase().includes(kw) ||
          s.category.toLowerCase().includes(kw) ||
          s.categoryDepth3.toLowerCase().includes(kw) ||
          s.tags.some((t) => t.toLowerCase().includes(kw))
        );
      })
      .filter((s) => {
        if (!selectedL1Category) return true;
        return (
          s.category === selectedL1Category ||
          s.categoryDepth3
            .toLowerCase()
            .includes(selectedL1Category.toLowerCase())
        );
      })
      .filter((s) => {
        if (!selectedL1Area) return true;
        return s.location.toLowerCase().includes(selectedL1Area.toLowerCase());
      });
  }, [searchKeyword, selectedL1Category, selectedL1Area, allSuppliers]);

  // Infinite scroll: show 30 initially, then +30 on intersection
  const PAGE_SIZE = 30;
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const loaderRef = React.useRef<HTMLDivElement | null>(null);

  // Reset visible count when filters or view change
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchKeyword, selectedL1Category, selectedL1Area, viewMode]);

  React.useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) =>
            Math.min(c + PAGE_SIZE, filteredSuppliers.length)
          );
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [filteredSuppliers.length]);

  // Mock counters for likes and favorites
  const getLikesCount = (supplier: { id: number }) => (supplier.id % 100) + 10;
  const getFavoritesCount = (supplier: { id: number }) =>
    (supplier.id % 50) + 5;

  // 카테고리 선택 핸들러
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

  // 지역 선택 핸들러
  const handleL1AreaChange = (value: string) => {
    try {
      setSelectedL1Area(value || "");
      setSelectedL2Area("all"); // 하위 단계를 "전체"로 설정
    } catch (error) {
      console.error("Error in handleL1AreaChange:", error);
    }
  };

  const handleL2AreaChange = (value: string) => {
    try {
      setSelectedL2Area(value || "all");
    } catch (error) {
      console.error("Error in handleL2AreaChange:", error);
    }
  };

  // Language-specific text content
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
        category: "2품목",
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

  // Helpers to display selected category path in root
  const getL1Label = React.useCallback(() => {
    if (!selectedL1Category) return "";
    return (
      l1Categories.find((c) => c.value === selectedL1Category)?.label || ""
    );
  }, [selectedL1Category, l1Categories]);
  const getL2Label = React.useCallback(() => {
    if (!selectedL1Category || selectedL2Category === "all") return "";
    return (
      l2Categories.find((c) => c.value === selectedL2Category)?.label || ""
    );
  }, [selectedL1Category, selectedL2Category, l2Categories]);
  const getL3Label = React.useCallback(() => {
    if (
      !selectedL1Category ||
      !selectedL2Category ||
      selectedL2Category === "all" ||
      selectedL3Category === "all"
    )
      return "";
    return (
      l3Categories.find((c) => c.value === selectedL3Category)?.label || ""
    );
  }, [
    selectedL1Category,
    selectedL2Category,
    selectedL3Category,
    l3Categories,
  ]);
  // const getCategoryPathLabel = React.useCallback(() => {
  //   const parts = [getL1Label(), getL2Label(), getL3Label()].filter(Boolean);
  //   if (parts.length === 0) return getText('allCategories');
  //   return parts.join(' / ');
  // }, [getL1Label, getL2Label, getL3Label, getText]);

  // Helpers for region labels
  const getAreaL1Label = React.useCallback(() => {
    if (!selectedL1Area) return "";
    return l1Areas.find((a) => a.value === selectedL1Area)?.label || "";
  }, [selectedL1Area, l1Areas]);
  const getAreaL2Label = React.useCallback(() => {
    if (!selectedL1Area || selectedL2Area === "all") return "";
    return l2Areas.find((a) => a.value === selectedL2Area)?.label || "";
  }, [selectedL1Area, selectedL2Area, l2Areas]);
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        isBannerVisible={isBannerVisible}
        setIsBannerVisible={setIsBannerVisible}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      {/* Main Content */}
      <main
        className="flex-1"
        style={{ paddingTop: isBannerVisible ? "112px" : "64px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {getText("pageTitle")}
            </h1>
          </div>
          <div className="flex gap-8 w-full">
            {/* Left Menu */}

            {/* Content */}
          </div>
          {/* Content Layout: Left (30%) + Right (70%) on PC, Full width on Mobile */}
          <SearchSidebar
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            getText={getText}
            getL1Categories={getL1Categories}
            getL2Categories={getL2Categories}
            getL3Categories={getL3Categories}
          />
          {/* 기존사이드검색바시작 */}
          <div className="flex gap-8">
            {/* <div className="hidden md:block w-[30%]">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {getText("searchTitle")}
                </h2>

                <div className="space-y-4"> */}
            {/* Search Input */}
            {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText("searchKeyword")}
                    </label>
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder={getText("searchPlaceholder")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div> */}

            {/* Category Filter - 3 Depth */}
            {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText("category")}
                    </label> */}

            {/* L1 Category */}
            {/* <select
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
                    </select> */}

            {/* L2 Category */}
            {/* {selectedL1Category && selectedL1Category !== "" && (
                      <select
                        value={selectedL2Category}
                        onChange={(e) => handleL2CategoryChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      >
                        <option value="all">{getText("allCategories")}</option>
                        {l2Categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    )} */}

            {/* L3 Category */}
            {/* {selectedL2Category && selectedL2Category !== "all" && (
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
                  </div> */}

            {/* Region Filter - 2 Depth */}
            {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText("region")}
                    </label> */}

            {/* L1 Area */}
            {/* <select
                      value={selectedL1Area}
                      onChange={(e) => handleL1AreaChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    >
                      <option value="">{getText("allRegions")}</option>
                      {l1Areas.map((area) => (
                        <option key={area.value} value={area.value}>
                          {area.label}
                        </option>
                      ))}
                    </select> */}

            {/* L2 Area */}
            {/* {selectedL1Area && (
                      <select
                        value={selectedL2Area}
                        onChange={(e) => handleL2AreaChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">{getText("allRegions")}</option>
                        {l2Areas.map((area) => (
                          <option key={area.value} value={area.value}>
                            {area.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div> */}

            {/* Company Size Filter */}
            {/* <div>
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
                  </div> */}

            {/* Action Buttons */}
            {/* <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        setSearchKeyword("");
                        setSelectedL1Category("");
                        setSelectedL2Category("all");
                        setSelectedL3Category("all");
                        setSelectedL1Area("");
                        setSelectedL2Area("all");
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
            </div> */}
            {/* 기존사이드검색바끝 */}

            {/* Right Area - Content Section (70% on PC, 100% on Mobile) */}
            <div className="w-full mt-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {/* Header with View Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {getText("resultsTitle")}
                    </h2>
                    <div className="text-sm text-gray-500">
                      {getText("totalResults").replace(
                        "{count}",
                        filteredSuppliers.length.toString()
                      )}
                    </div>
                  </div>

                  {/* View Mode Toggle - PC Only */}
                  <div className="hidden md:flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("gallery")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "gallery"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                      title={getText("galleryView")}
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                      title={getText("listView")}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Results Content */}
                {filteredSuppliers.length > 0 ? (
                  <>
                    {/* Gallery View - PC Default, Hidden on Mobile */}
                    {viewMode === "gallery" && (
                      <div className="hidden md:grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <SampleSupplierList samplesuppliers={samplesuppliers} />
                      </div>
                    )}

                    {/* List View - PC Optional, Mobile Default */}
                    {(viewMode === "list" || isMobile) && (
                      <div className="test">
                        <SampleSupplierList samplesuppliers={samplesuppliers} />
                        {filteredSuppliers
                          .slice(0, visibleCount)
                          .map((supplier) => (
                            <div
                              key={supplier.id}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow "
                            >
                              <div className="flex items-start gap-4">
                                {/* Company Icon - PC Only */}
                                <div className="hidden md:flex w-16 h-16 bg-gray-200 rounded-lg items-center justify-center flex-shrink-0">
                                  <div className="text-gray-400 text-2xl">
                                    🏢
                                  </div>
                                </div>

                                {/* Company Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2 flex-1">
                                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                                        {supplier.name}
                                      </h3>
                                      {supplier.website && (
                                        <a
                                          href={supplier.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 transition-colors"
                                          title="홈페이지 방문"
                                        >
                                          <ExternalLink className="h-4 w-4" />
                                        </a>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 ml-4" />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                      {supplier.categoryDepth3}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      {supplier.location}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {supplier.description}
                                  </p>
                                  {/* Tags */}
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {supplier.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  {/* Stats above detail button: rating, favorites, likes */}
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-1 text-yellow-600">
                                      <Star className="h-4 w-4 fill-current" />
                                      <span>{supplier.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Heart className="h-4 w-4 text-red-500" />
                                      <span>{getFavoritesCount(supplier)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <ThumbsUp className="h-4 w-4 text-blue-500" />
                                      <span>{getLikesCount(supplier)}</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-end">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                                      {getText("viewDetail")}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        {/* Loader sentinel */}
                        {visibleCount < filteredSuppliers.length && (
                          <div
                            ref={loaderRef}
                            className="py-6 text-center text-sm text-gray-500"
                          >
                            Loading...
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {getText("noMatchedSuppliers")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Search Button */}
      {isMobile && (
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition-colors"
          aria-label={getText("searchFilter")}
        >
          <Filter className="h-6 w-6" />
        </button>
      )}

      {/* Mobile Search Modal */}
      {isSearchModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsSearchModalOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-lg shadow-xl z-50 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {modalStep !== "root" ? (
                <button
                  onClick={() => setModalStep("root")}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              ) : (
                <div />
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {getText("searchFilter")}
              </h2>
              <button
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setModalStep("root");
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {modalStep === "root" && (
                <div className="p-4 space-y-4">
                  {/* Search Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText("searchKeyword")}
                    </label>
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder={getText("searchPlaceholder")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category triggers (separate like PC) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText("category")}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setModalStep("catL1")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                      >
                        <span className="truncate">
                          {getL1Label() || getText("allCategories")}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      {selectedL1Category !== "" && (
                        <button
                          type="button"
                          onClick={() => setModalStep("catL2")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                        >
                          <span className="truncate">
                            {getL2Label() || getText("allCategories")}
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                      {selectedL1Category !== "" &&
                        selectedL2Category !== "all" && (
                          <button
                            type="button"
                            onClick={() => setModalStep("catL3")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                          >
                            <span className="truncate">
                              {getL3Label() || getText("allCategories")}
                            </span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </button>
                        )}
                    </div>
                  </div>

                  {/* Region triggers (separate like PC) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText("region")}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setModalStep("areaL1")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                      >
                        <span className="truncate">
                          {getAreaL1Label() || getText("allRegions")}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      {selectedL1Area !== "" && (
                        <button
                          type="button"
                          onClick={() => setModalStep("areaL2")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                        >
                          <span className="truncate">
                            {getAreaL2Label() || getText("allRegions")}
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Size trigger */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText("companySize")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setModalStep("size")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                    >
                      <span>
                        {companySize === "large"
                          ? getText("largeCorp")
                          : companySize === "medium"
                          ? getText("mediumCorp")
                          : companySize === "small"
                          ? getText("smallCorp")
                          : companySize === "startup"
                          ? getText("startup")
                          : getText("allSizes")}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
              {modalStep === "catL1" && (
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    {getText("selectCategory")}
                  </h3>
                  <button
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                      selectedL1Category === ""
                        ? "text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      handleL1CategoryChange("");
                      setModalStep("root");
                    }}
                  >
                    {getText("allCategories")}
                  </button>
                  {l1Categories.map((c) => (
                    <button
                      key={c.value}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                        selectedL1Category === c.value
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        handleL1CategoryChange(c.value);
                        setModalStep("catL2");
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
              {modalStep === "catL2" && (
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    {getText("selectSubCategory")}
                  </h4>
                  <button
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                      selectedL2Category === "all"
                        ? "text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      handleL2CategoryChange("all");
                      setModalStep("root");
                    }}
                  >
                    {getText("allCategories")}
                  </button>
                  {l2Categories.map((c2) => (
                    <button
                      key={c2.value}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                        selectedL2Category === c2.value
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        handleL2CategoryChange(c2.value);
                        setModalStep("catL3");
                      }}
                    >
                      {c2.label}
                    </button>
                  ))}
                </div>
              )}
              {modalStep === "catL3" && (
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    {getText("selectDetailCategory")}
                  </h4>
                  <button
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                      selectedL3Category === "all"
                        ? "text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      handleL3CategoryChange("all");
                      setModalStep("root");
                    }}
                  >
                    {getText("allCategories")}
                  </button>
                  {l3Categories.map((c3) => (
                    <button
                      key={c3.value}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                        selectedL3Category === c3.value
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        handleL3CategoryChange(c3.value);
                        setModalStep("root");
                      }}
                    >
                      {c3.label}
                    </button>
                  ))}
                </div>
              )}
              {modalStep === "areaL1" && (
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    {getText("selectRegion")}
                  </h3>
                  <button
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                      selectedL1Area === ""
                        ? "text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      handleL1AreaChange("");
                      setModalStep("root");
                    }}
                  >
                    {getText("allRegions")}
                  </button>
                  {l1Areas.map((a) => (
                    <button
                      key={a.value}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                        selectedL1Area === a.value
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        handleL1AreaChange(a.value);
                        setModalStep("areaL2");
                      }}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
              {modalStep === "areaL2" && (
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    {getText("selectSubRegion")}
                  </h4>
                  <button
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                      selectedL2Area === "all"
                        ? "text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      handleL2AreaChange("all");
                      setModalStep("root");
                    }}
                  >
                    {getText("allRegions")}
                  </button>
                  {l2Areas.map((a2) => (
                    <button
                      key={a2.value}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                        selectedL2Area === a2.value
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        handleL2AreaChange(a2.value);
                        setModalStep("root");
                      }}
                    >
                      {a2.label}
                    </button>
                  ))}
                </div>
              )}
              {modalStep === "size" && (
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {getText("companySize")}
                  </h3>
                  {["", "large", "medium", "small", "startup"].map((key) => (
                    <button
                      key={key || "all"}
                      onClick={() => {
                        setCompanySize(key);
                        setModalStep("root");
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg ${
                        companySize === key
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {key === ""
                        ? getText("allSizes")
                        : key === "large"
                        ? getText("largeCorp")
                        : key === "medium"
                        ? getText("mediumCorp")
                        : key === "small"
                        ? getText("smallCorp")
                        : getText("startup")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer (only show on root step) */}
            {modalStep === "root" && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSearchKeyword("");
                      setSelectedL1Category("");
                      setSelectedL2Category("all");
                      setSelectedL3Category("all");
                      setSelectedL1Area("");
                      setSelectedL2Area("all");
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {getText("resetButton")}
                  </button>
                  <button
                    onClick={() => setIsSearchModalOpen(false)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {getText("searchButton")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Footer currentLanguage={currentLanguage} userCountry={userCountry} />
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={<div />}>
      <SuppliersContent />
    </Suspense>
  );
}

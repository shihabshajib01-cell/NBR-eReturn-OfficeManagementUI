import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppSearchField } from "../forms/AppSearchField";

export interface MobileSearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  placeholder?: string;
  hasActiveFilters?: boolean;
}

/**
 * Mobile search and filter component
 * Displays search input and filter icon side by side in a flex row
 * Filter icon opens overlay with filter options
 *
 * Requirements:
 * - Search input + Filter icon side by side (flex row)
 * - Filter uses only icon (no text)
 * - ~12px responsive padding
 * - Filter opens action/filter options on click
 */
export function MobileSearchFilter({
  searchValue,
  onSearchChange,
  onFilterClick,
  placeholder,
  hasActiveFilters = false,
}: MobileSearchFilterProps) {
  const { t: translateFilters } = useTranslation("filters");

  return (
    <div className="mobile-search-filter">
      {/* Search Input */}
      <div className="mobile-search-filter__search">
        <AppSearchField
          value={searchValue}
          onChange={onSearchChange}
          placeholder={placeholder || translateFilters("placeholders.search")}
          label={translateFilters("placeholders.search")}
          size="compact"
        />
      </div>

      {/* Filter Button (Icon Only) */}
      <button
        type="button"
        onClick={onFilterClick}
        className={`mobile-search-filter__filter-btn ${
          hasActiveFilters ? "mobile-search-filter__filter-btn--active" : ""
        }`}
        aria-label={translateFilters("labels.filters")}
      >
        <SlidersHorizontal size={18} strokeWidth={1.75} />
        {hasActiveFilters && (
          <span className="mobile-search-filter__filter-badge" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

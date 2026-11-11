import { useState, useMemo } from 'react';
import HeaderTicker from './components/HeaderTicker';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustMetrics from './components/TrustMetrics';
import CatalogSection from './components/CatalogSection';
import ProductSpotlight from './components/ProductSpotlight';
import PartnerBanner from './components/PartnerBanner';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import SampleWatermarkModal from './components/SampleWatermarkModal';
import LandCalculatorModal from './components/LandCalculatorModal';
import ArchitectJoinModal from './components/ArchitectJoinModal';
import CartDrawer from './components/CartDrawer';
import SavedModal from './components/SavedModal';
import CodeExportModal from './components/CodeExportModal';

import { BLUEPRINT_DESIGNS } from './data/mockData';
import { DEFAULT_MATERIAL_SELECTIONS } from './data/materialsData';
import { BlueprintDesign, CartItem, FilterState, CustomMaterialSelections, MaterialCategory, MaterialOption } from './types';

export default function App() {
  // Catalog & Spotlight State
  const [activeSpotlight, setActiveSpotlight] = useState<BlueprintDesign>(BLUEPRINT_DESIGNS[0]);
  const [savedIds, setSavedIds] = useState<string[]>(['tr-0815']);

  // Material Customizer State
  const [customSelections, setCustomSelections] = useState<CustomMaterialSelections>(DEFAULT_MATERIAL_SELECTIONS);

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    landWidth: '8-12',
    architectStyle: 'Tropis Modern',
    roomConfig: '4',
    selectedCategory: 'all',
    sortBy: 'popular',
    searchQuery: '',
  });

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Modals State
  const [checkoutTarget, setCheckoutTarget] = useState<{
    blueprint: BlueprintDesign;
    packageType: 'standard' | 'consultation';
    email: string;
  } | null>(null);

  const [sampleModalBlueprint, setSampleModalBlueprint] = useState<BlueprintDesign | null>(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [architectModalOpen, setArchitectModalOpen] = useState(false);
  const [architectModalTab, setArchitectModalTab] = useState<'calculator' | 'form'>('calculator');
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [codeExportOpen, setCodeExportOpen] = useState(false);

  // Filtered Blueprints
  const filteredBlueprints = useMemo(() => {
    return BLUEPRINT_DESIGNS.filter((item) => {
      // Category filter
      if (filter.selectedCategory !== 'all' && item.category !== filter.selectedCategory) {
        if (filter.selectedCategory === 'PBG Ready' && item.badgeTag !== 'PBG READY') {
          return false;
        }
      }

      // Search Query
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesFeature = item.featureHighlight.toLowerCase().includes(q);
        const matchesLand = `${item.minLandWidth}x${item.minLandLength}`.includes(q);
        if (!matchesTitle && !matchesCode && !matchesCategory && !matchesFeature && !matchesLand) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'newest') return b.code.localeCompare(a.code);
      if (filter.sortBy === 'price_asc') return a.priceDED - b.priceDED;
      if (filter.sortBy === 'land_asc') return a.landArea - b.landArea;
      if (filter.sortBy === 'rating') return b.rating - a.rating;
      // Default: popular (review count)
      return b.reviewCount - a.reviewCount;
    });
  }, [filter]);

  // Actions
  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectBlueprint = (blueprint: BlueprintDesign) => {
    setActiveSpotlight(blueprint);
    const spotlightEl = document.getElementById('spotlight-section');
    if (spotlightEl) {
      spotlightEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBuyFromCard = (blueprint: BlueprintDesign) => {
    // Add to cart or open direct checkout
    setCartItems((prev) => [
      ...prev,
      {
        blueprint,
        packageType: 'standard',
        price: blueprint.priceDED,
      },
    ]);
    setCartOpen(true);
  };

  const handleUpdateMaterialSelection = (category: MaterialCategory, option: MaterialOption) => {
    setCustomSelections((prev) => ({
      ...prev,
      [category]: option,
    }));
  };

  const handleResetMaterialSelections = () => {
    setCustomSelections(DEFAULT_MATERIAL_SELECTIONS);
  };

  const handleBuyDirect = (
    blueprint: BlueprintDesign,
    packageType: 'standard' | 'consultation',
    email: string
  ) => {
    setCheckoutTarget({
      blueprint,
      packageType,
      email,
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTogglePackage = (index: number) => {
    setCartItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newPkg = item.packageType === 'standard' ? 'consultation' : 'standard';
        const newPrice =
          newPkg === 'standard'
            ? item.blueprint.priceDED
            : item.blueprint.priceWithConsultation;
        return {
          ...item,
          packageType: newPkg,
          price: newPrice,
        };
      })
    );
  };

  const handleCheckoutFromCart = () => {
    if (cartItems.length === 0) return;
    const firstItem = cartItems[0];
    setCartOpen(false);
    setCheckoutTarget({
      blueprint: firstItem.blueprint,
      packageType: firstItem.packageType,
      email: 'budi.santoso@archmail.id',
    });
  };

  const handleApplyLandFilter = (width: number, length: number) => {
    setFilter((prev) => ({
      ...prev,
      searchQuery: `${width}x${length}`,
      selectedCategory: 'all',
    }));
    const catalogEl = document.getElementById('katalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e]">
      {/* 1. Header Ticker with SNI & PBG legal status */}
      <HeaderTicker />

      {/* 2. Top Navigation */}
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenArchitectModal={() => {
          setArchitectModalTab('form');
          setArchitectModalOpen(true);
        }}
        onOpenCalculator={() => setCalculatorOpen(true)}
        onSelectCategory={(cat) => {
          setFilter((prev) => ({ ...prev, selectedCategory: cat }));
        }}
        savedCount={savedIds.length}
        onOpenSavedModal={() => setSavedModalOpen(true)}
        onOpenCodeExport={() => setCodeExportOpen(true)}
      />

      {/* 3. Hero Section with Search & Multi-parameter selector */}
      <HeroSection
        filter={filter}
        onFilterChange={(newVals) => setFilter((prev) => ({ ...prev, ...newVals }))}
        onSearch={() => {
          const el = document.getElementById('katalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. Guarantees & Trust Metrics */}
      <TrustMetrics />

      {/* 5. Catalog of Ready-to-Build Designs */}
      <CatalogSection
        blueprints={filteredBlueprints}
        selectedCategory={filter.selectedCategory}
        onSelectCategory={(cat) => setFilter((prev) => ({ ...prev, selectedCategory: cat }))}
        sortBy={filter.sortBy}
        onSortChange={(sort) => setFilter((prev) => ({ ...prev, sortBy: sort }))}
        onSelectBlueprint={handleSelectBlueprint}
        onBuyBlueprint={handleBuyFromCard}
        savedIds={savedIds}
        onToggleSave={handleToggleSave}
        onOpenCalculator={() => setCalculatorOpen(true)}
      />

      {/* 6. Product Spotlight (Exact 1:1 match of Villa Kayu Manis #TR-0815) */}
      <div id="spotlight-section">
        <ProductSpotlight
          blueprint={activeSpotlight}
          customSelections={customSelections}
          onUpdateMaterialSelection={handleUpdateMaterialSelection}
          onResetMaterialSelections={handleResetMaterialSelections}
          onBuyDirect={handleBuyDirect}
          onOpenSampleModal={() => setSampleModalBlueprint(activeSpotlight)}
        />
      </div>

      {/* 7. Architect Partnership & 80% Royalty Banner */}
      <PartnerBanner
        onOpenJoinModal={() => {
          setArchitectModalTab('form');
          setArchitectModalOpen(true);
        }}
        onOpenRoyaltyCalculator={() => {
          setArchitectModalTab('calculator');
          setArchitectModalOpen(true);
        }}
      />

      {/* 8. Comprehensive Footer */}
      <Footer
        onOpenArchitectModal={() => {
          setArchitectModalTab('form');
          setArchitectModalOpen(true);
        }}
        onOpenComplianceInfo={() => setCalculatorOpen(true)}
        onOpenCodeExport={() => setCodeExportOpen(true)}
      />

      {/* MODALS & DRAWERS */}
      {/* Checkout & Escrow Payment Modal */}
      {checkoutTarget && (
        <CheckoutModal
          blueprint={checkoutTarget.blueprint}
          packageType={checkoutTarget.packageType}
          email={checkoutTarget.email}
          customSelections={customSelections}
          onClose={() => setCheckoutTarget(null)}
          onSuccess={() => {
            // Clear cart if this item was in cart
            setCartItems((prev) =>
              prev.filter((i) => i.blueprint.id !== checkoutTarget.blueprint.id)
            );
          }}
        />
      )}

      {/* Watermarked Sample PDF Viewer Modal */}
      {sampleModalBlueprint && (
        <SampleWatermarkModal
          blueprint={sampleModalBlueprint}
          onClose={() => setSampleModalBlueprint(null)}
          onProceedToBuy={() => {
            handleBuyDirect(sampleModalBlueprint, 'standard', 'budi.santoso@archmail.id');
          }}
        />
      )}

      {/* Land & RAB Calculator Modal */}
      {calculatorOpen && (
        <LandCalculatorModal
          onClose={() => setCalculatorOpen(false)}
          onApplyLandFilter={handleApplyLandFilter}
          blueprints={BLUEPRINT_DESIGNS}
          onSelectBlueprint={handleSelectBlueprint}
        />
      )}

      {/* Architect Partner Portal & Royalty Simulator Modal */}
      {architectModalOpen && (
        <ArchitectJoinModal
          defaultTab={architectModalTab}
          onClose={() => setArchitectModalOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onTogglePackage={handleTogglePackage}
        onCheckout={handleCheckoutFromCart}
      />

      {/* Saved Blueprints Modal */}
      <SavedModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedIds={savedIds}
        blueprints={BLUEPRINT_DESIGNS}
        onSelectBlueprint={handleSelectBlueprint}
        onToggleSave={handleToggleSave}
      />

      {/* Code Export & Developer Package Modal */}
      <CodeExportModal
        isOpen={codeExportOpen}
        onClose={() => setCodeExportOpen(false)}
      />
    </div>
  );
}

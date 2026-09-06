import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { routes } from '../routes/routes';
import { useAuthorization } from '../auth/useAuthorization';
import { permissions, type Permission } from '../auth/permissions';

// Assume these icons are imported from an icon library
import {
  ChevronDownIcon,
  MoreDotIcon,
  ListIcon,
  ShieldIcon,
  GridIcon,
  GroupIcon,
} from '../icons';
import { useSidebar } from '../context/SidebarContext';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permissions?: Permission[];
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Dashboard',
    path: routes.dashboard.home,
    permissions: [permissions.dashboard.view],
    // subItems: [{ name: 'Dashboard', path: '/', pro: false }],
  },
];

const administrationItems: NavItem[] = [
  {
    icon: <GroupIcon />,
    name: 'Users',
    path: routes.users.index,
    permissions: [
      permissions.users.view,
      permissions.users.create,
      permissions.users.update,
      permissions.users.delete,
      permissions.users.restore,
    ],
  },
  {
    icon: <ShieldIcon />,
    name: 'Roles & Permissions',
    path: routes.roles.index,
    permissions: [
      permissions.roles.view,
      permissions.roles.create,
      permissions.roles.update,
      permissions.roles.delete,
      permissions.roles.managePermissions,
    ],
  },
  {
    icon: <ListIcon />,
    name: 'Audit Logs',
    path: routes.auditLogs.index,
    permissions: [permissions.auditLogs.view],
  },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <UserCircleIcon />,
  //   name: 'My Profile',
  //   path: '/profile',
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { canAny } = useAuthorization();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'administration' | 'others';
    name: string;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname],
  );

  const isVisible = useCallback(
    (nav: NavItem) =>
      !nav.permissions ||
      nav.permissions.length === 0 ||
      canAny(nav.permissions),
    [canAny],
  );

  const filterVisibleItems = useCallback(
    (items: NavItem[]) => items.filter((nav) => isVisible(nav)),
    [isVisible],
  );

  const visibleNavItems = filterVisibleItems(navItems);
  const visibleAdministrationItems = filterVisibleItems(administrationItems);
  const visibleOthersItems = filterVisibleItems(othersItems);

  useEffect(() => {
    let submenuMatched = false;
    ['main', 'others'].forEach((menuType) => {
      const items = menuType === 'main' ? visibleNavItems : visibleOthersItems;
      items.forEach((nav) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as 'main' | 'others',
                name: nav.name,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [isActive, visibleNavItems, visibleOthersItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.name}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    name: string,
    menuType: 'main' | 'administration' | 'others',
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.name === name
      ) {
        return null;
      }
      return { type: menuType, name };
    });
  };

  const renderMenuItems = (
    items: NavItem[],
    menuType: 'main' | 'administration' | 'others',
  ) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(nav.name, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.name === nav.name
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'lg:justify-start'
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType &&
                  openSubmenu?.name === nav.name
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.name === nav.name
                      ? 'rotate-180 text-brand-500'
                      : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${nav.name}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType &&
                  openSubmenu?.name === nav.name
                    ? `${subMenuHeight[`${menuType}-${nav.name}`]}px`
                    : '0px',
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? 'menu-dropdown-item-active'
                          : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? 'w-[290px]'
            : isHovered
              ? 'w-[290px]'
              : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link to={routes.dashboard.home}>
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/laravel-api-base-horizontal.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/laravel-api-base-horizontal.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/laravel-api-base-stacked.png"
              alt="Logo"
              width={64}
              height={64}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {visibleNavItems.length > 0 && (
                <>
                  <h2
                    className={`mb-4 flex text-xs uppercase leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? 'lg:justify-center'
                        : 'justify-start'
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      'Menu'
                    ) : (
                      <MoreDotIcon className="size-6" />
                    )}
                  </h2>
                  {renderMenuItems(visibleNavItems, 'main')}
                </>
              )}
            </div>
            {visibleAdministrationItems.length > 0 && (
              <div className="">
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'justify-start'
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    'Administration'
                  ) : (
                    <MoreDotIcon />
                  )}
                </h2>
                {renderMenuItems(visibleAdministrationItems, 'administration')}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

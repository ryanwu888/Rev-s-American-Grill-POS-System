import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from "react-i18next";

i18n.use(LanguageDetector)
    .use(initReactI18next).init({
        //debug: true,
        lng: "en",
        returnObjects: true,
        resources: {
            en: {
                translation: { //English Translations
                    leftSideButton: {
                        inventory: "View Inventory",
                        menu: "Edit Menu",
                        report: "Reports",
                        employee: "Employees",
                        refresh: "Refresh",
                        exit: "Log Out",
                    },
                    order: "Order History Trends",
                    rightSideButton: {
                        manager: "Manager's Dashboard",
                        info: "Reports",
                        alert: "Item Stock Low!",
                    },
                    translate: {
                        translation: "Translation",
                        english: "English",
                        spanish: "Spanish",
                        chinese: "Chinese",
                        french: "French",
                    },
                },
            },

            fr: { //French Translations
                translation: {
                    leftSideButton: {
                        inventory: "Voir l'inventaire",
                        menu: "Modifier le menu",
                        report: "Rapports",
                        employee: "Employés",
                        refresh: 'Actualiser',
                        exit: 'Se déconnecter',

                    },
                    order: 'Tendances de l’historique des commandes',
                    rightSideButton: {
                        manager: "Tableau de bord du gestionnaire",
                        info: "Rapports",
                        alert: "Stock d'articles faible !",
                    },
                    translate: {
                        translation: 'Traduction',
                        english: 'Anglais',
                        spanish: 'Espagnol',
                        chinese: 'Chinois',
                        french: 'Français',
                    },

                },
            },
            zh: { // Chinese translations
                translation: {
                    leftSideButton: {
                        inventory: '查看库存',
                        menu: '编辑菜单',
                        report: '报告',
                        employee: '员工',
                        refresh: '刷新',
                        exit: '退出',

                    },
                    order: '订单历史趋势',
                    rightSideButton: {
                        manager: "经理仪表板",
                        info: "报告",
                        alert: "库存不足！",
                    },
                    translate: {
                        translation: '翻译',
                        english: '英语',
                        spanish: '西班牙语',
                        chinese: '中文',
                        french: '法语',
                    },

                },
            },
            es: { // Spanish translations
                translation: {
                    leftSideButton: {
                        inventory: 'Ver inventario',
                        menu: 'Editar menú',
                        report: 'Informes',
                        employee: 'Empleados',
                        refresh: 'Actualizar',
                        exit: 'Salir',

                    },
                    order: 'Tendencias del historial de pedidos',
                    rightSideButton: {
                        manager: "Tablero del Gerente",
                        info: "Informes",
                        alert: "¡Stock de Artículos Bajo!",
                    },
                    translate: {
                        translation: 'Traducción',
                        english: 'Inglés',
                        spanish: 'Español',
                        chinese: 'Chino',
                        french: 'Francés',
                    },
                },
            },
        }
    });
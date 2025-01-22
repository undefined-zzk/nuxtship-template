// import TeamImg1 from "~/assets/img/team1.avif";
// import TeamImg2 from "~/assets/img/team2.avif";
// import TeamImg3 from "~/assets/img/team3.avif";
export default defineEventHandler(() => {
  const pricing = [
    {
        name: "Personal",
        zhname: "个人的",
        price: "Free",
        zhprice: "免费的",
        popular: false,
        features: [
            "Lifetime free",
            "Up to 3 users",
            "Unlimited Pages",
            "Nuxt Sub domain",
            "Basic Integrations",
            "Community Support",
        ],
        zhfeatures: [
            '终身免费',
            '最多 3 位用户',
            '无限页面',
            'Nuxt 子域名',
            '基本集成',
            '社区支持'
        ],
        button: {
            text: "Get Started",
            type: 'start',
            link: "/",
        },
    },
    {
        name: "Startup",
        zhname: "启动",
        zhprice: '',
        price: {
            monthly: "$19",
            zmonthly: '19美元',
            annual: "$16",
            discount: "10%",
            original: "$24",
        },
        popular: true,
        features: [
            "All Free Features",
            "Up to 20 users",
            "20 Custom domains",
            "Unlimited Collaborators",
            "Advanced Integrations",
            "Priority Support",
        ],
        zhfeatures: [
            '所有免费功能',
            '最多 20 个用户',
            '20 个自定义域名',
            '无限合作者',
            '高级集成',
            '优先支持'
        ],
        button: {
            text: "Get Started",
            type: 'start',
            link: "#",
        },
    },
    {
        name: "Enterprise",
        zhname: '企业',
        price: "Custom",
        zhprice: '风俗',
        popular: false,
        features: [
            "All Pro Features",
            "Unlimited Custom domains",
            "99.99% Uptime SLA",
            "SAML & SSO Integration",
            "Dedicated Account Manager",
            "24/7 Phone Support",
        ],
        zhfeatures: [
            '所有专业功能',
            '无限自定义域名',
            '99.99% 正常运行时间 SLA',
            'SAML 和 SSO 集成',
            '专属客户经理',
            '24/7 电话支持'
        ],
        button: {
            text: "Contact us",
            type: 'contactus',
            link: "/contact",
        },
    },
];

  return pricing;
});

export default {
    formKey: 'mobileCardAndTopup',
    topup: {
        id: 'topup',
        formTitleHTML:
        '<p style="line-height: 13pt; font-size: 10pt; color: rgba(36, 37, 61, 0.6); font-family: HelveticaNeue;">Giảm trực tiếp <span style="font-weight: 700; color: rgb(0 ,130, 231);">12%</span> số tiền nạp, cho 3 nhà mạng viettel, mobifone và vinaphone</p>',
        secondButtonURL: 'https://appay-rc.cloudcms.vn/app/topup?tab=history',
        mainButtonURL: '',
        items: [
            {
                name: 'Viettel',
                label: 'Viettel',
                value: 'vt',
                imageUrl: 'https://appay-rc.cloudcms.vn/assets/img/topup/viettel.png',
            },
            {
                name: 'Mobifone',
                label: 'Mobifone',
                value: 'mb',
                imageUrl: 'https://appay-rc.cloudcms.vn/assets/img/topup/mobifone.png',
            },
            {
                name: 'Vinaphone',
                label: 'Vinaphone',
                value: 'vn',
                imageUrl: 'https://appay-rc.cloudcms.vn/assets/img/topup/vinaphone.png',
            },
        ],
        amount: [
            {
                ori_price: 30000,
                price: 27000,
            },
            {
                ori_price: 40000,
                price: 36000,
            },
            {
                ori_price: 50000,
                price: 45000,
            },
            {
                ori_price: 100000,
                price: 90000,
            },
            {
                ori_price: 200000,
                price: 180000,
            },
            {
                ori_price: 250000,
                price: 225000,
            },
        ],
    },
    mobileCard: {
        id: 'mobileCard',
        selectedIndex: 0,
        secondButtonURL: 'https://appay-rc.cloudcms.vn/mobile_card/manage',
        mainButtonURL: '',
        maxCanPurchase: 3,
        formTitleHTML:
        '<p style="line-height: 13pt; font-size: 10pt; color: rgba(36, 37, 61, 0.6); font-family: HelveticaNeue;">Giảm trực tiếp lên đến <span style="font-weight: 700; color: rgb(0 ,130, 231);">4%</span>  giá trị thẻ cào, cho 3 nhà mạng viettel, mobifone và vinaphone </p>',
        items: [
        {
            label: 'Viettel',
            description:
            '<p style="font-size: 10pt; color: rgba(36, 37, 61, 1); font-family: HelveticaNeue;">Chiết khấu <span style="font-weight: 600;">2.5%</span> khi mua </p>',
            imageUrl: 'https://appay-rc.cloudcms.vn/assets/img/topup/viettel.png',
            discount: '2.5',
            extraData: {
            telcoAlias: 'VTT',
            },
            listRouting: [
            {
                price: '10000',
                discount: '2.5',
                provider_code: 'zota',
            },
            {
                price: '20000',
                discount: '2.5',
                provider_code: 'zota',
            },
            {
                price: '50000',
                discount: '2.5',
                provider_code: 'zota',
            },
            {
                price: '100000',
                discount: '2.5',
                provider_code: 'zota',
            },
            {
                price: '200000',
                discount: '2.5',
                provider_code: 'zota',
            },
            {
                price: '500000',
                discount: '2.5',
                provider_code: 'zota',
            },
            ],
        },
        {
            label: 'Mobifone',
            description:
            '<p style="font-size: 10pt; color: rgba(36, 37, 61, 1); font-family: HelveticaNeue;">Chiết khấu <span style="font-weight: 600;">3.5%</span> khi mua </p>',
            imageUrl: 'https://appay-rc.cloudcms.vn/assets/img/topup/mobifone.png',
            discount: '3.5',
            secondButtonURL: '',
            mainButtonURL: '',
            extraData: {
            telcoAlias: 'VMS',
            },
            listRouting: [
            {
                price: '10000',
                discount: '3.5',
                provider_code: 'zota',
            },
            {
                price: '20000',
                discount: '2.5',
                provider_code: 'zota',
            },
            {
                price: '50000',
                discount: '3.5',
                provider_code: 'zota',
            },
            {
                price: '100000',
                discount: '3.5',
                provider_code: 'zota',
            },
            {
                price: '200000',
                discount: '3.5',
                provider_code: 'zota',
            },
            {
                price: '500000',
                discount: '3.5',
                provider_code: 'zota',
            },
            ],
        },
        {
            label: 'Vinaphone',
            description:
            '<p style="font-size: 10pt; color: rgba(36, 37, 61, 1); font-family: HelveticaNeue;">Chiết khấu <span style="font-weight: 600;">3.5%</span> khi mua </p>',
            imageUrl: 'https://appay-rc.cloudcms.vn/assets/img/topup/vinaphone.png',
            discount: '3.5',
            extraData: {
            telcoAlias: 'VNP',
            },
            listRouting: [
            {
                price: '10000',
                discount: '3.5',
                provider_code: 'zota',
            },
            {
                price: '20000',
                discount: '3.5',
                provider_code: 'zota',
            },
            {
                price: '50000',
                discount: '3.5',
                provider_code: 'zota',
            },
            {
                price: '100000',
                discount: '3.5',
                provider_code: 'zota',
            },
            {
                price: '200000',
                discount: '3.5',
                provider_code: 'zota',
            },
            {
                price: '500000',
                discount: '3.5',
                provider_code: 'zota',
            },
            ],
        },
        ],
    }
}
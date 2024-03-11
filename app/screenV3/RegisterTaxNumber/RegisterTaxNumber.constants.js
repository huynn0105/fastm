export const key = {
    mobilePhone: 'mobilePhone',
    email: 'email',
    homeAddress: 'homeAddress',
    homeProvince: 'homeProvince',
    homeWard: 'homeWard',
    homeDistrict: 'homeDistrict',
    currentAddress: 'currentAddress',
    currentProvince: 'currentProvince',
    currentDistrict: 'currentDistrict',
    currentWard: 'currentWard',

}

export const initPayload = {
    mobilePhone: null,
    email: null,
    homeAddress: null,
    homeProvince: null,
    homeWard: null,
    homeDistrict: null,
    currentAddress: null,
    currentProvince: null,
    currentDistrict: null,
    currentWard: null,
}

export const SECTION_LIST = [
    {
        title: '',
        id: 'COUNTRYID_INFOR',
        note: '',
        data: [] 
    },
    {
        preTitle: "Địa chỉ",
        boldTitle: " đăng ký theo hộ khẩu",
        id: 'THUONG_TRU',
        data: [[
            {
                id: 'province',
                key: key.homeProvince,
                label: 'Tỉnh / thành phố *',
                typeInput: 'PICKER',
                errorMessage: 'Tỉnh / thành phố không được để trống',
            },
            {
                id: 'district',
                key: key.homeDistrict,
                label: 'Quận / Huyện *',
                typeInput: 'PICKER',
                errorMessage: 'Quận / Huyện không được để trống',
            },
            {
                id: 'ward',
                key: key.homeWard,
                label: 'Phường / Xã *',
                typeInput: 'PICKER',
                errorMessage: 'Phường/ xã không được để trống',
            },
            {
                id: 'address',
                key: key.homeAddress,
                label: 'Số nhà/ đường phố, thôn, xóm *',
                typeInput: 'TEXT',
                errorMessage: 'Địa chỉ không được để trống',
            }
        ]]
    },
    {
        preTitle: "Địa chỉ",
        boldTitle: " nơi cư trú",
        id: 'TAM_TRU',
        data: [[
            {
                id: 'province',
                key: key.currentProvince,
                label: 'Tỉnh / thành phố *',
                typeInput: 'PICKER',
                errorMessage: 'Tỉnh / thành phố không được để trống',
            },
            {
                id: 'district',
                key: key.currentDistrict,
                label: 'Quận / Huyện *',
                typeInput: 'PICKER',
                errorMessage: 'Quận / Huyện không được để trống',
            },
            {
                id: 'ward',
                key: key.currentWard,
                label: 'Phường / Xã *',
                typeInput: 'PICKER',
                errorMessage: 'Phường/ xã không được để trống',
            },
            {
                id: 'address',
                key: key.currentAddress,
                label: 'Số nhà/ đường phố, thôn, xóm *',
                typeInput: 'TEXT',
                errorMessage: 'Địa chỉ không được để trống',
            }
        ]]
    },
    {
        preTitle: "Thông tin khác",
        id: 'BASIC_INFOR',
        data: [[
            {
                id: 'mobilePhone',
                key: key.mobilePhone,
                label: 'SĐT liên hệ *',
                typeInput: 'TEXT',
                keyboardType: 'number-pad',
                errorMessage: 'SĐT không được để trống',
            },
            {
                id: 'email',
                key: key.email,
                label: 'Email liên hệ *',
                typeInput: 'TEXT',
                keyboardType: 'email-address',
                errorMessage: 'Email không được để trống',
            },
        ]]
    },
    {
        id: 'BUTTON_SUBMIT',
        data: [] 
    }
]
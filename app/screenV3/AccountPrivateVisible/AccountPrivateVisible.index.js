import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, FlatList, RefreshControl } from 'react-native'

import DigitelClient from '../../network/DigitelClient';

import PrivateVisibleItem from './comps/PrivateVisibleItem';
// dummy data
// import { LIST_PRIVATE_VISIBLE } from './AccountPrivateVisible.contants';

import AppText from '../../componentV3/AppText';


import styles from './AccountPrivateVisible.style';

const AccountPrivateVisible = () => {
    // list configs
    const [listConfigs, setListConfigs] = useState([]);

    useEffect(() => {
        getListPrivacyConfigs();
    }, []);

    const getListPrivacyConfigs = async () => {
        const response = await DigitelClient.getListPrivacyConfig();
        if(response) {
            setListConfigs(response?.data || []);
        }
    }

    const onToggle = useCallback(
        (item, isActive) => {
            DigitelClient.updatePrivacyConfig({
                categoryID: item.categoryID,
                status: isActive ? '0' : '1',
                })
                .then((results) => {
                    if (!results.status) {
                    Alert.alert(
                        item.name,
                        'Cập nhật trạng thái không thành công, vui lòng thử lại.',
                        [
                        {
                            text: 'OK',
                            onPress: getListPrivacyConfigs,
                        },
                        ],
                        { cancelable: false },
                    );
                    }
                })
                .catch(() => {
                    Alert.alert(
                    item.name,
                    'Cập nhật trạng thái không thành công, vui lòng thử lại.',
                    [
                        {
                        text: 'OK',
                        onPress: getListPrivacyConfigs,
                        },
                    ],
                    { cancelable: false },
                    );
                });
        },
        [listConfigs, getListPrivacyConfigs],
    );

    const itemSeparatorComponent = useCallback(
        () => <View style={styles.divider} />,
        [],
    )

    const renderHeaderList = useCallback(
        () => <AppText style={styles.titleH1}>Thông tin của bạn được hiển thị khi</AppText>,
        [],
    );

    const renderItem = useCallback(
        ({ item }) => {
            return (
                <PrivateVisibleItem
                    id={item?.categoryID}
                    initIsActive={item?.status === '1'}
                    title={item?.name}
                    description={item?.description}
                    onToggle={(isActive) => onToggle(item, isActive)}
                />
            )
        },
        [],
    )

    const onRefresh = useCallback(
        () => {
            getListPrivacyConfigs();
        },
        [getListPrivacyConfigs],
    );

    return (
        <View style={styles.wrapper}>
            <FlatList
                data={listConfigs}
                refreshControl={
                    <RefreshControl
                      refreshing={false}
                      onRefresh={onRefresh}
                    />
                }
                keyExtractor={(item) => item?.categoryID}
                renderItem={renderItem}
                ItemSeparatorComponent={itemSeparatorComponent}
                ListHeaderComponent={renderHeaderList()}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
    )
}

export default AccountPrivateVisible

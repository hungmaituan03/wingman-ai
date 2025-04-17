import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import Colors from '../../../constants/Colors';

const { width, height } = Dimensions.get('window');
const theme = Colors.dark;

export default StyleSheet.create({
    drawerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: height,
        width: width * 0.8,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 30 : 60,
        paddingHorizontal: 16,
        zIndex: 999,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    drawerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_600SemiBold',
        color: theme.text,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,   
        fontFamily: 'Poppins_400Regular',   
        color: 'black',
        fontSize: 16,         
    },
    sessionList: {
        flex: 1,
        marginBottom: 16,
    },
    sessionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 8,
    },      
    sessionText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#333',
    },      
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: theme.textSecondary,
        marginTop: 20,
        fontFamily: 'Poppins_400Regular',
    },
    newChatButton: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newChatText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    deleteButton: {
        padding: 8,
    },
    rightActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    actionButton: {
        padding: 10,
        marginLeft: 8,
        backgroundColor: '#f2f2f2',
        borderRadius: 6,
    },
});
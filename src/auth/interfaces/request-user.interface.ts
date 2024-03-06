interface RequestUser extends Request {
    user: {
        username: string;
        role: string;
    }
}

export default RequestUser;
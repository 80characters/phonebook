module.exports = {
    form: {
        addNew: {
            rules: {
                name: {
                    presence: true,
                    length: {
                        minimum: 6
                    }
                },
                email: {
                    presence: true,
                    email: true,
                },
                phone: {
                    presence: true,
                    length: {
                        minimum: 8,
                        maximum: 13
                    },
                    format: {
                        pattern: "^[0-9\+\s-]{8,13}",
                        flags: "i",
                        message: "is invalid format"
                    }
                },
                address: {
                    presence: true,
                    length: {
                        minimum: 6
                    }
                }
            }
        }
    }
};

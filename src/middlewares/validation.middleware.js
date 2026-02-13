import { body, validationResult } from 'express-validator';
//validating entries
export const handleValidationErrors = (view, getContext = () => ({})) => {
    return (req, res, next) => {
        const errors = validationResult(req);
        //collecting validation erros
        if (!errors.isEmpty()) {
            const context = getContext(req);//getting extra data if requireded
            return res.render(view, {
                ...context,//rending page with error msgs
                errorMessage: errors.array()[0].msg,
                errors: errors.array(),
                oldInput: req.body//previous data
            });
        }
        next();//if no errors
    };
};
//job validation rules
export const jobValidationRules = [
    body('category').notEmpty().withMessage('Job category is required'),
    body('designation').notEmpty().withMessage('Designation is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('companyName').notEmpty().withMessage('Company Name is required'),
    body('salary').notEmpty().withMessage('Salary is required'),
    body('positions').isNumeric().withMessage('Number of positions must be a number'),
    body('skills').notEmpty().withMessage('Skills are required'),
    body('dueDate').isDate().withMessage('Valid due date is required')
];

export const applicantValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('contact').notEmpty().withMessage('Contact number is required')
];

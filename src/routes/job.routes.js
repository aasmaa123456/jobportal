//crud jobs
import express from 'express';
import JobController from '../controllers/job.controller.js';
import { auth } from '../middlewares/auth.middleware.js';//login check
import { upload } from '../middlewares/file-upload.middleware.js';
import { jobValidationRules, handleValidationErrors, applicantValidationRules } from '../middlewares/validation.middleware.js';

const router = express.Router();
const jobController = new JobController();

// Public & Recruiter Routes Ordered
router.get('/search', jobController.searchJobs);
router.get('/new', auth, jobController.getCreateJob);
router.post('/', auth, jobValidationRules, handleValidationErrors('jobs/new', (req) => ({ user: req.session.user, title: 'Post Job' })), jobController.postCreateJob);

router.get('/:id', jobController.getJobDetails);
router.get('/', jobController.getAllJobs);

router.get('/:id/update', auth, jobController.getUpdateJob);
router.post('/:id/update', auth, jobValidationRules, handleValidationErrors('jobs/update', (req) =>
     ({ job: { ...req.body, id: req.params.id }, title: 'Update Job' })), jobController.postUpdateJob);

router.get('/:id/delete', auth, (req, res) => {
    res.render('jobs/delete-confirm', { jobId: req.params.id, title: 'Delete Job' });
});

router.post('/:id/delete', auth, jobController.deleteJob);

router.get('/:id/applicants', auth, jobController.getApplicants);

// Application
router.post('/:id/apply', upload.single('resume'), applicantValidationRules, handleValidationErrors('jobs/detail', (req) =>
     ({ job: req.job /* Context issue */ })), jobController.postApply);

export default router;

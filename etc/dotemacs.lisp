
(setq inhibit-startup-message t)
(setq backup-directory-alist nil)
(setq backup-directory-alist
     (cons (cons "\\.*$" (expand-file-name "~/opt/tmp/backup"))
  backup-directory-alist))
(global-font-lock-mode t)
(xterm-mouse-mode t)
(show-paren-mode t)
(transient-mark-mode t)
(global-set-key "\C-cs" 'slime-selector)

(defun cliki:start-slime ()
   (unless (slime-connected-p)
     (save-excursion (slime))))

(add-hook 'slime-mode-hook 'cliki:start-slime)

(add-hook 'slime-mode-hook 'hs-minor-mode)
(put 'downcase-region 'disabled nil)



(setq-default
 frame-title-format
 (list '((buffer-file-name " %f" (dired-directory 
	 			  dired-directory
				  (revert-buffer-function " %b"
				  ("%b - Dir:  " default-directory)))))))

(column-number-mode)
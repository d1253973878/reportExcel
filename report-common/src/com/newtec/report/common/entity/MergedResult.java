

package com.newtec.report.common.entity;

/**
 *  记录工作表的行列信息以及行列合并情况
 * @author Administrator
 * @Description 工作表行列信息
 * @date 2021年1月25日
 */
public class MergedResult {
    private boolean merged;
    private int startRow;
    private int endRow;
    private int startCol;
    private int endCol;

    public MergedResult(boolean merged, int startRow, int endRow, int startCol, int endCol) {
        this.merged = merged;
        this.startRow = startRow;
        this.endRow = endRow;
        this.startCol = startCol;
        this.endCol = endCol;
    }

    public boolean isMerged() {
        return this.merged;
    }

    public void setMerged(boolean merged) {
        this.merged = merged;
    }

    public int getStartRow() {
        return this.startRow;
    }

    public void setStartRow(int startRow) {
        this.startRow = startRow;
    }

    public int getEndRow() {
        return this.endRow;
    }

    public void setEndRow(int endRow) {
        this.endRow = endRow;
    }

    public int getStartCol() {
        return this.startCol;
    }

    public void setStartCol(int startCol) {
        this.startCol = startCol;
    }

    public int getEndCol() {
        return this.endCol;
    }

    public void setEndCol(int endCol) {
        this.endCol = endCol;
    }

    public String toString() {
        return "MergedResult{merged=" + this.merged + ", startRow=" + this.startRow + ", endRow=" + this.endRow + ", startCol=" + this.startCol + ", endCol=" + this.endCol + '}';
    }
}
